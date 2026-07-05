import prisma from "../config/prisma";

export const getParts = async () => {
	return await prisma.masterPart.findMany({
		where: { aktif: true },
	});
};

export const createPart = async (data: {
	uniqNo: string;
	name: string;
	model?: string;
	commodity: any;
}) => {
	return await prisma.masterPart.create({
		data: {
			uniqNo: data.uniqNo,
			name: data.name,
			model: data.model,
			commodity: data.commodity,
		},
	});
};

export const getMaterials = async () => {
	return await prisma.masterMaterial.findMany({
		include: { m_supplier: true },
	});
};

export const createMaterial = async (data: {
	code: string;
	name: string;
	supplierId?: string;
}) => {
	return await prisma.masterMaterial.create({
		data: {
			code: data.code,
			name: data.name,
			supplier_id: data.supplierId,
		},
	});
};
