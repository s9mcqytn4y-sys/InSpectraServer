import prisma from "../config/prisma";

export const submitLaporanHarian = async (payload: {
	tanggal: string;
	tipe_proses: string;
	mp_direct?: number;
	mp_indirect?: number;
	jkn_hour?: number;
	jkn_menit?: number;
	ot_prod?: number;
	ot_non?: number;
	bantuan_keluar?: number;
	bantuan_masuk?: number;
	details: {
		id_part: string;
		planning: number;
		actual: number;
		ng: number;
	}[];
}) => {
	return await prisma.$transaction(async (tx) => {
		const laporan = await tx.e_laporan_produksi.upsert({
			where: {
				tanggal_tipe_proses: {
					tanggal: new Date(payload.tanggal),
					tipe_proses: payload.tipe_proses,
				},
			},
			update: {
				mp_direct: payload.mp_direct,
				mp_indirect: payload.mp_indirect,
				jkn_hour: payload.jkn_hour,
				jkn_menit: payload.jkn_menit,
				ot_prod: payload.ot_prod,
				ot_non: payload.ot_non,
				bantuan_keluar: payload.bantuan_keluar,
				bantuan_masuk: payload.bantuan_masuk,
			},
			create: {
				tanggal: new Date(payload.tanggal),
				tipe_proses: payload.tipe_proses,
				mp_direct: payload.mp_direct || 0,
				mp_indirect: payload.mp_indirect || 0,
				jkn_hour: payload.jkn_hour || 0,
				jkn_menit: payload.jkn_menit || 0,
				ot_prod: payload.ot_prod || 0,
				ot_non: payload.ot_non || 0,
				bantuan_keluar: payload.bantuan_keluar || 0,
				bantuan_masuk: payload.bantuan_masuk || 0,
			},
		});

		// Hapus detail lama jika ada (sinkronisasi)
		await tx.e_laporan_produksi_detail.deleteMany({
			where: { id_laporan: laporan.id },
		});

		// Tambah detail baru
		if (payload.details && payload.details.length > 0) {
			await tx.e_laporan_produksi_detail.createMany({
				data: payload.details.map((d) => ({
					id_laporan: laporan.id,
					id_part: d.id_part,
					planning: d.planning,
					actual: d.actual,
					ng: d.ng,
				})),
			});
		}

		return await tx.e_laporan_produksi.findUnique({
			where: { id: laporan.id },
			include: { e_laporan_produksi_detail: true },
		});
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
