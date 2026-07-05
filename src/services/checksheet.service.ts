import prisma from "../config/prisma";

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

export const getSessions = async () => {
	return await prisma.checksheetSession.findMany({
		orderBy: { dibuat_pada: "desc" },
	});
};
