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

export const getLaporan = async (
	params: {
		page?: number;
		limit?: number;
		search?: string;
		startDate?: Date;
		endDate?: Date;
	} = {},
) => {
	const { page = 1, limit = 10, search, startDate, endDate } = params;
	const skip = (page - 1) * limit;

	const where: any = {};

	if (search) {
		where.tipe_proses = { contains: search, mode: "insensitive" };
	}

	if (startDate || endDate) {
		where.tanggal = {};
		if (startDate) where.tanggal.gte = startDate;
		if (endDate) where.tanggal.lte = endDate;
	}

	const [data, total] = await Promise.all([
		prisma.e_laporan_produksi.findMany({
			where,
			skip,
			take: limit,
			orderBy: { tanggal: "desc" },
			include: { e_laporan_produksi_detail: true },
		}),
		prisma.e_laporan_produksi.count({ where }),
	]);

	return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};
