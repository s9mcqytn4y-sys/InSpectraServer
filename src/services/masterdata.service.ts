import type {
	kategori_defect_inspectra,
	tipe_proses_inspectra,
} from "@prisma/client";
import prisma from "../config/prisma";

export const getParts = async (
	params: { page?: number; limit?: number; search?: string } = {},
) => {
	const { page = 1, limit = 10, search } = params;
	const skip = (page - 1) * limit;

	const where: any = { aktif: true };
	if (search) {
		where.name = { contains: search, mode: "insensitive" };
	}

	const [data, total] = await Promise.all([
		prisma.masterPart.findMany({
			where,
			skip,
			take: limit,
			orderBy: { dibuat_pada: "desc" },
		}),
		prisma.masterPart.count({ where }),
	]);

	return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const createPart = async (data: {
	uniqNo: string;
	part_no?: string;
	name: string;
	model?: string;
	customer?: string;
	commodity: tipe_proses_inspectra;
	aktif?: boolean;
	catatan?: string;
	kode_internal?: string;
}) => {
	return await prisma.masterPart.create({
		data: {
			uniqNo: data.uniqNo,
			part_no: data.part_no,
			name: data.name,
			model: data.model,
			customer: data.customer,
			commodity: data.commodity,
			aktif: data.aktif ?? true,
			catatan: data.catatan,
			kode_internal: data.kode_internal,
		},
	});
};

export const getMaterials = async (
	params: { page?: number; limit?: number; search?: string } = {},
) => {
	const { page = 1, limit = 10, search } = params;
	const skip = (page - 1) * limit;

	const where: any = { aktif: true };
	if (search) {
		where.name = { contains: search, mode: "insensitive" };
	}

	const [data, total] = await Promise.all([
		prisma.masterMaterial.findMany({
			where,
			skip,
			take: limit,
			orderBy: { dibuat_pada: "desc" },
			include: { m_supplier: true },
		}),
		prisma.masterMaterial.count({ where }),
	]);

	return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const createMaterial = async (data: {
	code: string;
	name: string;
	kategori_material?: string;
	satuan?: any;
	spec_ringkas?: string;
	aktif?: boolean;
	supplier_id?: string | null;
}) => {
	return await prisma.masterMaterial.create({
		data: {
			code: data.code,
			name: data.name,
			kategori_material: data.kategori_material,
			satuan: data.satuan ?? "UNKNOWN",
			spec_ringkas: data.spec_ringkas,
			aktif: data.aktif ?? true,
			supplier_id: data.supplier_id,
		},
	});
};

export const getDefects = async (
	params: { page?: number; limit?: number; search?: string } = {},
) => {
	const { page = 1, limit = 10, search } = params;
	const skip = (page - 1) * limit;

	const where: any = { aktif: true };
	if (search) {
		where.name = { contains: search, mode: "insensitive" };
	}

	const [data, total] = await Promise.all([
		prisma.masterDefect.findMany({
			where,
			skip,
			take: limit,
			orderBy: { dibuat_pada: "desc" },
		}),
		prisma.masterDefect.count({ where }),
	]);

	return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const createDefect = async (data: {
	id_defect: string;
	name: string;
	category: kategori_defect_inspectra;
	deskripsi?: string;
	severity_default?: number;
}) => {
	return await prisma.masterDefect.create({
		data: {
			id_defect: data.id_defect,
			name: data.name,
			category: data.category,
			deskripsi: data.deskripsi,
			severity_default: data.severity_default,
		},
	});
};
