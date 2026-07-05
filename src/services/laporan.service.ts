import prisma from "../config/prisma";

export const createLaporan = async (data: {
	tanggal: string;
	tipe_proses: string;
}) => {
	return await prisma.e_laporan_produksi.create({
		data: {
			tanggal: new Date(data.tanggal),
			tipe_proses: data.tipe_proses,
		},
	});
};

export const getLaporan = async () => {
	return await prisma.e_laporan_produksi.findMany({
		orderBy: { tanggal: "desc" },
	});
};
