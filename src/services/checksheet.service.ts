import { Prisma, type tipe_proses_inspectra } from "@prisma/client";
import prisma from "../config/prisma";

// ============================================================
// Interface Types
// ============================================================

interface DefectSlotInput {
	slot_waktu_id: string;
	jumlah: number;
}

interface DefectInput {
	id_defect: string;
	nama_defect_snapshot: string;
	kategori: string;
	jumlah: number;
	fotoUrl?: string;
	slots?: DefectSlotInput[];
}

interface ItemInput {
	uniq_no: string;
	jumlah_diperiksa: number;
	jumlah_ok: number;
	jumlah_ng: number;
	catatan?: string;
	defects?: DefectInput[];
}

interface BatchSubmitInput {
	session: {
		idempotency_key?: string;
		tipe_proses: string;
		nama_shift: string;
		nama_operator?: string;
		nama_line?: string;
		device_id?: string;
		app_version?: string;
	};
	items: ItemInput[];
}

// ============================================================
// Existing Endpoints (dipertahankan)
// ============================================================

export const startSession = async (data: {
	tipe_proses: any;
	nama_shift: string;
	nama_operator: string;
}) => {
	return await prisma.checksheetSession.create({
		data: {
			tipe_proses: data.tipe_proses,
			nama_shift: data.nama_shift,
			nama_operator: data.nama_operator,
		},
	});
};

export const submitItemCheck = async (data: {
	id_sesi: string;
	uniq_no: string;
	jumlah_diperiksa: number;
	jumlah_ok: number;
	jumlah_ng: number;
	catatan?: string;
}) => {
	return await prisma.$transaction(async (tx) => {
		const rasio_ng =
			data.jumlah_diperiksa > 0
				? (data.jumlah_ng / data.jumlah_diperiksa) * 100
				: 0;

		const item = await tx.e_item_checksheet.create({
			data: {
				id_sesi: data.id_sesi,
				uniq_no: data.uniq_no,
				jumlah_diperiksa: data.jumlah_diperiksa,
				jumlah_ok: data.jumlah_ok,
				jumlah_ng: data.jumlah_ng,
				rasio_ng: rasio_ng,
				catatan: data.catatan,
			},
		});

		const sesi = await tx.checksheetSession.findUnique({
			where: { id: data.id_sesi },
		});

		if (sesi) {
			const new_total_diperiksa = sesi.total_diperiksa + data.jumlah_diperiksa;
			const new_totalOk = sesi.totalOk + data.jumlah_ok;
			const new_totalNg = sesi.totalNg + data.jumlah_ng;
			const new_rasio_ng_global =
				new_total_diperiksa > 0 ? (new_totalNg / new_total_diperiksa) * 100 : 0;

			await tx.checksheetSession.update({
				where: { id: data.id_sesi },
				data: {
					total_diperiksa: new_total_diperiksa,
					totalOk: new_totalOk,
					totalNg: new_totalNg,
					rasio_ng_global: new_rasio_ng_global,
				},
			});
		}

		return item;
	});
};

export const submitDefect = async (data: {
	id_item: string;
	id_defect: string;
	nama_defect_snapshot: string;
	kategori: any;
	jumlah: number;
	fotoUrl?: string;
}) => {
	return await prisma.e_defect_checksheet.create({
		data: {
			id_item: data.id_item,
			id_defect: data.id_defect,
			nama_defect_snapshot: data.nama_defect_snapshot,
			kategori: data.kategori,
			jumlah: data.jumlah,
			fotoUrl: data.fotoUrl,
		},
	});
};

export const getSessions = async (
	params: {
		page?: number;
		limit?: number;
		tipe_proses?: string;
		tanggal?: string;
	} = {},
) => {
	const { page = 1, limit = 20, tipe_proses, tanggal } = params;
	const skip = (page - 1) * limit;

	const where: any = {};
	if (tipe_proses) where.tipe_proses = tipe_proses;
	if (tanggal) {
		const tgl = new Date(tanggal);
		const besok = new Date(tgl);
		besok.setDate(besok.getDate() + 1);
		where.tanggal_pemeriksaan = { gte: tgl, lt: besok };
	}

	const [data, total] = await Promise.all([
		prisma.checksheetSession.findMany({
			where,
			skip,
			take: limit,
			orderBy: { dibuat_pada: "desc" },
			include: {
				e_item_checksheet: {
					include: {
						e_defect_checksheet: {
							include: { e_defect_slot_checksheet: true },
						},
					},
				},
			},
		}),
		prisma.checksheetSession.count({ where }),
	]);

	return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// ============================================================
// NEW: Batch Submit (1 Request = Seluruh Data dalam 1 Transaksi)
// ============================================================

export const submitBatch = async (input: BatchSubmitInput) => {
	return await prisma.$transaction(async (tx) => {
		// --- Cek Idempotency Key ---
		if (input.session.idempotency_key) {
			const existingSession = await tx.checksheetSession.findUnique({
				where: { idempotency_key: input.session.idempotency_key },
				include: {
					e_item_checksheet: {
						include: {
							e_defect_checksheet: {
								include: { e_defect_slot_checksheet: true },
							},
						},
					},
				},
			});
			if (existingSession) {
				return {
					sesi: existingSession,
					items: existingSession.e_item_checksheet,
					ringkasan: {
						total_item: existingSession.e_item_checksheet.length,
						total_diperiksa: existingSession.total_diperiksa,
						total_ok: existingSession.totalOk,
						total_ng: existingSession.totalNg,
						rasio_ng_global: Number(existingSession.rasio_ng_global),
					},
				};
			}
		}

		// --- Validasi tipe_proses ---
		const tipeProses = input.session.tipe_proses as tipe_proses_inspectra;

		// --- Validasi: Semua uniq_no harus ada dan aktif ---
		const uniqNos = input.items.map((i) => i.uniq_no);
		const partsCek = await tx.masterPart.findMany({
			where: { uniqNo: { in: uniqNos }, aktif: true },
			select: { uniqNo: true, commodity: true },
		});
		const validUniqNos = new Set(partsCek.map((p) => p.uniqNo));
		const invalidParts = uniqNos.filter((u) => !validUniqNos.has(u));
		if (invalidParts.length > 0) {
			throw new Error(
				`Part tidak ditemukan atau tidak aktif: ${invalidParts.join(", ")}`,
			);
		}

		// --- Validasi: Semua id_defect harus ada dan aktif ---
		const allDefectIds = input.items.flatMap(
			(i) => i.defects?.map((d) => d.id_defect) ?? [],
		);
		if (allDefectIds.length > 0) {
			const defectsCek = await tx.masterDefect.findMany({
				where: { id_defect: { in: allDefectIds }, aktif: true },
				select: { id_defect: true },
			});
			const validDefectIds = new Set(defectsCek.map((d) => d.id_defect));
			const invalidDefects = [...new Set(allDefectIds)].filter(
				(id) => !validDefectIds.has(id),
			);
			if (invalidDefects.length > 0) {
				throw new Error(
					`Defect tidak ditemukan atau tidak aktif: ${invalidDefects.join(", ")}`,
				);
			}

			// --- Validasi STRICT: Setiap defect harus terdaftar di m_part_defect untuk part terkait ---
			const partDefectMappings = await tx.m_part_defect.findMany({
				where: {
					uniq_no: { in: uniqNos },
					aktif: true,
				},
				select: { uniq_no: true, id_defect: true },
			});

			// Buat Set "uniqNo:defectId" yang valid
			const validMappingSet = new Set(
				partDefectMappings.map((m) => `${m.uniq_no}:${m.id_defect}`),
			);

			// Cek setiap item-defect kombinasi
			for (const item of input.items) {
				if (!item.defects) continue;
				for (const defect of item.defects) {
					const key = `${item.uniq_no}:${defect.id_defect}`;
					if (!validMappingSet.has(key)) {
						throw new Error(
							`Defect "${defect.id_defect}" tidak terdaftar untuk Part "${item.uniq_no}". ` +
								`Pastikan mapping m_part_defect sudah dikonfigurasi.`,
						);
					}
				}
			}
		}

		// --- 1. Buat Sesi Checksheet dan Relasi (Nested Writes) ---
		let totalDiperiksa = 0;
		let totalOk = 0;
		let totalNg = 0;
		for (const item of input.items) {
			totalDiperiksa += item.jumlah_diperiksa;
			totalOk += item.jumlah_ok;
			totalNg += item.jumlah_ng;
		}
		const rasioNgGlobal =
			totalDiperiksa > 0 ? (totalNg / totalDiperiksa) * 100 : 0;

		const sesi = await tx.checksheetSession.create({
			data: {
				tipe_proses: tipeProses,
				nama_shift: input.session.nama_shift,
				nama_operator: input.session.nama_operator,
				nama_line: input.session.nama_line,
				device_id: input.session.device_id,
				app_version: input.session.app_version,
				idempotency_key: input.session.idempotency_key,
				total_diperiksa: totalDiperiksa,
				totalOk: totalOk,
				totalNg: totalNg,
				rasio_ng_global: rasioNgGlobal,
				e_item_checksheet: {
					create: input.items.map((itemInput) => {
						if (
							itemInput.jumlah_ok + itemInput.jumlah_ng >
							itemInput.jumlah_diperiksa
						) {
							throw new Error(
								`Part ${itemInput.uniq_no}: jumlah OK + NG tidak boleh melebihi jumlah diperiksa`,
							);
						}
						const totalDefectQty =
							itemInput.defects?.reduce((acc, d) => acc + d.jumlah, 0) || 0;
						if (totalDefectQty > itemInput.jumlah_ng) {
							throw new Error(
								`Part ${itemInput.uniq_no}: total kuantitas defect (${totalDefectQty}) melebihi jumlah NG (${itemInput.jumlah_ng})`,
							);
						}

						const rasioNg =
							itemInput.jumlah_diperiksa > 0
								? (itemInput.jumlah_ng / itemInput.jumlah_diperiksa) * 100
								: 0;

						return {
							uniq_no: itemInput.uniq_no,
							jumlah_diperiksa: itemInput.jumlah_diperiksa,
							jumlah_ok: itemInput.jumlah_ok,
							jumlah_ng: itemInput.jumlah_ng,
							rasio_ng: rasioNg,
							catatan: itemInput.catatan,
							e_defect_checksheet: {
								create:
									itemInput.defects?.map((defectInput) => {
										const totalSlotQty =
											defectInput.slots?.reduce(
												(acc, s) => acc + s.jumlah,
												0,
											) || 0;
										if (
											defectInput.slots &&
											defectInput.slots.length > 0 &&
											totalSlotQty !== defectInput.jumlah
										) {
											throw new Error(
												`Defect ${defectInput.id_defect} pada Part ${itemInput.uniq_no}: total alokasi slot (${totalSlotQty}) harus sama dengan jumlah defect (${defectInput.jumlah})`,
											);
										}

										return {
											id_defect: defectInput.id_defect,
											nama_defect_snapshot: defectInput.nama_defect_snapshot,
											kategori: defectInput.kategori as any,
											jumlah: defectInput.jumlah,
											fotoUrl: defectInput.fotoUrl,
											e_defect_slot_checksheet: {
												create:
													defectInput.slots?.map((slot) => ({
														slot_waktu_id: slot.slot_waktu_id,
														jumlah: slot.jumlah,
													})) || [],
											},
										};
									}) || [],
							},
						};
					}),
				},
			},
			include: {
				e_item_checksheet: {
					include: {
						e_defect_checksheet: {
							include: { e_defect_slot_checksheet: true },
						},
					},
				},
			},
		});

		return {
			sesi,
			items: sesi.e_item_checksheet,
			ringkasan: {
				total_item: input.items.length,
				total_diperiksa: totalDiperiksa,
				total_ok: totalOk,
				total_ng: totalNg,
				rasio_ng_global: Number(rasioNgGlobal.toFixed(3)),
			},
		};
	});
};

// ============================================================
// GET: Slot Waktu per Tipe Proses
// ============================================================

export const getSlotWaktu = async (tipe_proses?: string) => {
	const where: any = { aktif: true };
	if (tipe_proses) where.tipe_proses = tipe_proses;

	return await prisma.m_slot_waktu.findMany({
		where,
		orderBy: [{ tipe_proses: "asc" }, { urutan: "asc" }],
	});
};
