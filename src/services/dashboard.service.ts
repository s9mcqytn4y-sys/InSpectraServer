import type { tipe_proses_inspectra } from "@prisma/client";
import prisma from "../config/prisma";

// ============================================================
// Helper: Build date range where clause
// ============================================================
function buildDateRange(startDate?: string, endDate?: string) {
	if (!startDate && !endDate) return undefined;
	const range: any = {};
	if (startDate) range.gte = new Date(startDate);
	if (endDate) range.lte = new Date(endDate);
	return range;
}

// ============================================================
// Existing: Top Defects (dari e_defect_checksheet)
// ============================================================
export const getTopDefects = async (filters: {
	startDate?: string;
	endDate?: string;
}) => {
	const dateRange = buildDateRange(filters.startDate, filters.endDate);
	const whereClause: any = {};
	if (dateRange) whereClause.dibuat_pada = dateRange;

	const topDefects = await prisma.e_defect_checksheet.groupBy({
		by: ["id_defect", "nama_defect_snapshot"],
		_sum: { jumlah: true },
		where: whereClause,
		orderBy: { _sum: { jumlah: "desc" } },
		take: 5,
	});

	return topDefects.map((d) => ({
		id_defect: d.id_defect,
		defect: d.nama_defect_snapshot,
		jumlah: d._sum.jumlah || 0,
	}));
};

// ============================================================
// Existing: OEE Metrics (dari e_laporan_produksi)
// ============================================================
export const getOeeMetrics = async (filters: {
	startDate?: string;
	endDate?: string;
	tipe_proses?: tipe_proses_inspectra;
}) => {
	const whereClause: any = {};
	const dateRange = buildDateRange(filters.startDate, filters.endDate);
	if (dateRange) whereClause.tanggal = dateRange;
	if (filters.tipe_proses) whereClause.tipe_proses = filters.tipe_proses;

	const details = await prisma.e_laporan_produksi_detail.aggregate({
		_sum: { planning: true, actual: true, ng: true },
		where: { e_laporan_produksi: whereClause },
	});

	const planning = details._sum?.planning || 0;
	const actual = details._sum?.actual || 0;
	const ng = details._sum?.ng || 0;

	const availability = planning > 0 ? actual / planning : 0;
	const performance = planning > 0 ? actual / planning : 0;
	const goodPieces = actual - ng;
	const quality = actual > 0 ? goodPieces / actual : 0;
	const oee = availability * performance * quality;

	return {
		planning,
		actual,
		ng,
		goodPieces,
		availability: (availability * 100).toFixed(2),
		performance: (performance * 100).toFixed(2),
		quality: (quality * 100).toFixed(2),
		oee: (oee * 100).toFixed(2),
	};
};

// ============================================================
// Existing: NG Rate global
// ============================================================
export const getNgRate = async (filters: {
	startDate?: string;
	endDate?: string;
	tipe_proses?: string;
}) => {
	const whereClause: any = {};
	const dateRange = buildDateRange(filters.startDate, filters.endDate);
	if (dateRange) whereClause.tanggal_pemeriksaan = dateRange;
	if (filters.tipe_proses) whereClause.tipe_proses = filters.tipe_proses;

	const sessions = await prisma.checksheetSession.aggregate({
		_sum: { totalOk: true, totalNg: true },
		where: whereClause,
	});

	const totalOk = sessions._sum?.totalOk || 0;
	const totalNg = sessions._sum?.totalNg || 0;
	const totalDiperiksa = totalOk + totalNg;
	const ngRate = totalDiperiksa > 0 ? (totalNg / totalDiperiksa) * 100 : 0;

	return {
		total_diperiksa: totalDiperiksa,
		total_ok: totalOk,
		total_ng: totalNg,
		ng_rate: ngRate.toFixed(2),
	};
};

// ============================================================
// NEW: Pareto Defect per Time Slot (4 Slots)
// ============================================================

/**
 * Mengambil data Pareto defect (Top N) yang dikelompokkan per slot waktu.
 * Format output siap dikonsumsi frontend untuk Pareto Chart.
 */
export const getPareto = async (filters: {
	startDate?: string;
	endDate?: string;
	tipe_proses?: string;
	top_n?: number;
}) => {
	const topN = filters.top_n ?? 5;
	const whereSession: any = {};
	const dateRange = buildDateRange(filters.startDate, filters.endDate);
	if (dateRange) whereSession.tanggal_pemeriksaan = dateRange;
	if (filters.tipe_proses) whereSession.tipe_proses = filters.tipe_proses;

	// 1. Ambil Top-N defect (berdasarkan total jumlah)
	const topDefects = await prisma.e_defect_checksheet.groupBy({
		by: ["id_defect", "nama_defect_snapshot"],
		_sum: { jumlah: true },
		where: {
			e_item_checksheet: {
				e_sesi_checksheet: whereSession,
			},
		},
		orderBy: { _sum: { jumlah: "desc" } },
		take: topN,
	});

	if (topDefects.length === 0) {
		return { pareto: [], total_ng_keseluruhan: 0 };
	}

	const topDefectIds = topDefects.map((d) => d.id_defect);
	const totalNgKeseluruhan = topDefects.reduce(
		(acc, d) => acc + (d._sum.jumlah || 0),
		0
	);

	// 2. Ambil alokasi per slot untuk Top-N defect tersebut
	const slotAlokasi = await prisma.e_defect_slot_checksheet.findMany({
		where: {
			e_defect_checksheet: {
				id_defect: { in: topDefectIds },
				e_item_checksheet: {
					e_sesi_checksheet: whereSession,
				},
			},
		},
		include: {
			m_slot_waktu: {
				select: { kode_slot: true, label_waktu: true, urutan: true },
			},
			e_defect_checksheet: {
				select: { id_defect: true, nama_defect_snapshot: true },
			},
		},
	});

	// 3. Strukturkan hasil: groupBy defect kemudian slot
	const paretoMap = new Map<
		string,
		{
			id_defect: string;
			nama_defect: string;
			total: number;
			persentase: number;
			per_slot: Record<string, number>;
		}
	>();

	for (const td of topDefects) {
		paretoMap.set(td.id_defect, {
			id_defect: td.id_defect,
			nama_defect: td.nama_defect_snapshot,
			total: td._sum.jumlah || 0,
			persentase: totalNgKeseluruhan > 0
				? Number((((td._sum.jumlah || 0) / totalNgKeseluruhan) * 100).toFixed(2))
				: 0,
			per_slot: {},
		});
	}

	for (const alokasi of slotAlokasi) {
		const defectId = alokasi.e_defect_checksheet.id_defect;
		const slotLabel = alokasi.m_slot_waktu?.label_waktu ?? "Tidak Diketahui";
		const entry = paretoMap.get(defectId);
		if (entry) {
			entry.per_slot[slotLabel] = (entry.per_slot[slotLabel] || 0) + alokasi.jumlah;
		}
	}

	return {
		pareto: Array.from(paretoMap.values()),
		total_ng_keseluruhan: totalNgKeseluruhan,
	};
};

// ============================================================
// NEW: Trend NG Rate per Hari & per Slot Waktu
// ============================================================

/**
 * Mengambil tren rasio NG per hari, dikelompokkan per slot waktu.
 * Berguna untuk mendeteksi apakah ada pola waktu tertentu yang rawan NG.
 */
export const getTrends = async (filters: {
	startDate?: string;
	endDate?: string;
	tipe_proses?: string;
}) => {
	const whereSession: any = {};
	const dateRange = buildDateRange(filters.startDate, filters.endDate);
	if (dateRange) whereSession.tanggal_pemeriksaan = dateRange;
	if (filters.tipe_proses) whereSession.tipe_proses = filters.tipe_proses;

	// 1. Ambil sesi beserta summary per hari
	const sesi = await prisma.checksheetSession.findMany({
		where: whereSession,
		select: {
			tanggal_pemeriksaan: true,
			total_diperiksa: true,
			totalNg: true,
			rasio_ng_global: true,
			tipe_proses: true,
		},
		orderBy: { tanggal_pemeriksaan: "asc" },
	});

	// 2. Group per tanggal
	const trendMap = new Map<
		string,
		{ tanggal: string; total_diperiksa: number; total_ng: number; sesi_count: number }
	>();

	for (const s of sesi) {
		const tgl = s.tanggal_pemeriksaan.toISOString().split("T")[0];
		if (!trendMap.has(tgl)) {
			trendMap.set(tgl, { tanggal: tgl, total_diperiksa: 0, total_ng: 0, sesi_count: 0 });
		}
		const entry = trendMap.get(tgl)!;
		entry.total_diperiksa += s.total_diperiksa;
		entry.total_ng += s.totalNg;
		entry.sesi_count += 1;
	}

	// 3. Ambil tren defect per slot waktu (untuk grafik overlay)
	const slotTrend = await prisma.e_defect_slot_checksheet.findMany({
		where: {
			e_defect_checksheet: {
				e_item_checksheet: {
					e_sesi_checksheet: whereSession,
				},
			},
		},
		include: {
			m_slot_waktu: {
				select: { kode_slot: true, label_waktu: true, urutan: true },
			},
			e_defect_checksheet: {
				select: { id_item: true },
				include: {
					e_item_checksheet: {
						select: { e_sesi_checksheet: { select: { tanggal_pemeriksaan: true } } },
					},
				},
			},
		},
	});

	// 4. Agregasi slot per tanggal
	const slotPerHari = new Map<string, Record<string, number>>();
	for (const sd of slotTrend) {
		const sesiObj = (sd.e_defect_checksheet as any)?.e_item_checksheet?.e_sesi_checksheet;
		if (!sesiObj?.tanggal_pemeriksaan) continue;
		const tgl = new Date(sesiObj.tanggal_pemeriksaan).toISOString().split("T")[0];
		const slotLabel = sd.m_slot_waktu?.label_waktu ?? "Tidak Diketahui";

		if (!slotPerHari.has(tgl)) slotPerHari.set(tgl, {});
		const daySlots = slotPerHari.get(tgl)!;
		daySlots[slotLabel] = (daySlots[slotLabel] || 0) + sd.jumlah;
	}

	const trendHarian = Array.from(trendMap.values()).map((hari) => ({
		...hari,
		ng_rate: hari.total_diperiksa > 0
			? Number(((hari.total_ng / hari.total_diperiksa) * 100).toFixed(3))
			: 0,
		per_slot: slotPerHari.get(hari.tanggal) ?? {},
	}));

	return { trend_harian: trendHarian };
};
