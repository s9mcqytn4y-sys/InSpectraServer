import prisma from "../config/prisma";

export const createLaporan = async (data: {
	tanggal: string;
	tipe_proses: string;
	mp_direct?: number;
	mp_indirect?: number;
	jkn_hour?: number;
	jkn_menit?: number;
	ot_prod?: number;
	ot_non?: number;
}) => {
	return await prisma.e_laporan_produksi.create({
		data: {
			tanggal: new Date(data.tanggal),
			tipe_proses: data.tipe_proses,
			mp_direct: data.mp_direct,
			mp_indirect: data.mp_indirect,
			jkn_hour: data.jkn_hour,
			jkn_menit: data.jkn_menit,
			ot_prod: data.ot_prod,
			ot_non: data.ot_non,
		},
	});
};

export const createLaporanDetail = async (data: {
	id_laporan: string;
	id_part: string;
	planning: number;
	actual: number;
	ng: number;
}) => {
	return await prisma.e_laporan_produksi_detail.create({
		data: {
			id_laporan: data.id_laporan,
			id_part: data.id_part,
			planning: data.planning,
			actual: data.actual,
			ng: data.ng,
		},
	});
};

export const getLaporan = async () => {
	return await prisma.e_laporan_produksi.findMany({
		orderBy: { tanggal: "desc" },
		include: { e_laporan_produksi_detail: true },
	});
};
