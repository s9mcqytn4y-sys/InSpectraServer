import prisma from "../config/prisma";

export const createBatch = async (data: {
	id_sesi: string;
	material_id: string;
}) => {
	return await prisma.cuttingBatch.create({
		data: {
			id_sesi: data.id_sesi,
			material_id: data.material_id,
		},
	});
};

export const getBatches = async () => {
	return await prisma.cuttingBatch.findMany({
		orderBy: { dibuat_pada: "desc" },
	});
};
