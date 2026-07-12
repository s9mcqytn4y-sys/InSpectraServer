import type {
	kategori_defect_inspectra,
	tipe_proses_inspectra,
} from "@prisma/client";
import prisma from "../config/prisma";
import { CACHE_KEYS, invalidatePrefix, referenceCache } from "../utils/cache";

export const getParts = async (
	params: {
		page?: number;
		limit?: number;
		search?: string;
		commodity?: string;
		last_sync_time?: string;
	} = {},
) => {
	const { page = 1, limit = 10, search, commodity, last_sync_time } = params;

	const cacheKey = `${CACHE_KEYS.PARTS}_${page}_${limit}_${search || ""}_${commodity || ""}_${last_sync_time || ""}`;
	const cached = referenceCache.get<any>(cacheKey);
	if (cached) return cached;

	const skip = (page - 1) * limit;
	const where: any = { aktif: true };

	if (search) {
		where.OR = [
			{ name: { contains: search, mode: "insensitive" } },
			{ uniqNo: { contains: search, mode: "insensitive" } },
			{ part_no: { contains: search, mode: "insensitive" } },
		];
	}
	if (commodity) {
		where.commodity = commodity;
	}
	if (last_sync_time) {
		where.diperbarui_pada = { gt: new Date(last_sync_time) };
	}

	const [data, total] = await Promise.all([
		prisma.masterPart.findMany({
			where,
			skip,
			take: limit,
			orderBy: { dibuat_pada: "desc" },
			include: {
				m_part_image: {
					include: { m_media_asset: true },
				},
				m_part_defect: {
					where: { aktif: true },
					include: {
						m_defect: {
							select: { id_defect: true, name: true, category: true },
						},
					},
					orderBy: { urutan: "asc" },
				},
			},
		}),
		prisma.masterPart.count({ where }),
	]);

	const result = {
		data,
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit),
	};
	referenceCache.set(cacheKey, result);
	return result;
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
	const part = await prisma.masterPart.create({
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
	invalidatePrefix(CACHE_KEYS.PARTS);
	return part;
};

export const updatePart = async (
	uniqNo: string,
	data: Partial<{
		part_no: string;
		name: string;
		model: string;
		customer: string;
		commodity: tipe_proses_inspectra;
		aktif: boolean;
		catatan: string;
		kode_internal: string;
	}>,
) => {
	const part = await prisma.masterPart.update({
		where: { uniqNo },
		data,
	});
	invalidatePrefix(CACHE_KEYS.PARTS);
	return part;
};

export const deletePart = async (uniqNo: string) => {
	const part = await prisma.masterPart.update({
		where: { uniqNo },
		data: { aktif: false },
	});
	invalidatePrefix(CACHE_KEYS.PARTS);
	return part;
};

export const getMaterials = async (
	params: {
		page?: number;
		limit?: number;
		search?: string;
		last_sync_time?: string;
	} = {},
) => {
	const { page = 1, limit = 10, search, last_sync_time } = params;

	const cacheKey = `${CACHE_KEYS.MATERIALS}_${page}_${limit}_${search || ""}_${last_sync_time || ""}`;
	const cached = referenceCache.get<any>(cacheKey);
	if (cached) return cached;

	const skip = (page - 1) * limit;
	const where: any = { aktif: true };

	if (search) {
		where.name = { contains: search, mode: "insensitive" };
	}
	if (last_sync_time) {
		where.diperbarui_pada = { gt: new Date(last_sync_time) };
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

	const result = {
		data,
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit),
	};
	referenceCache.set(cacheKey, result);
	return result;
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
	const material = await prisma.masterMaterial.create({
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
	invalidatePrefix(CACHE_KEYS.MATERIALS);
	return material;
};

export const updateMaterial = async (
	code: string,
	data: Partial<{
		name: string;
		kategori_material: string;
		satuan: any;
		spec_ringkas: string;
		aktif: boolean;
		supplier_id: string | null;
	}>,
) => {
	const material = await prisma.masterMaterial.update({
		where: { code },
		data,
	});
	invalidatePrefix(CACHE_KEYS.MATERIALS);
	return material;
};

export const deleteMaterial = async (code: string) => {
	const material = await prisma.masterMaterial.update({
		where: { code },
		data: { aktif: false },
	});
	invalidatePrefix(CACHE_KEYS.MATERIALS);
	return material;
};

export const getDefects = async (
	params: {
		page?: number;
		limit?: number;
		search?: string;
		last_sync_time?: string;
	} = {},
) => {
	const { page = 1, limit = 10, search, last_sync_time } = params;

	const cacheKey = `${CACHE_KEYS.DEFECTS}_${page}_${limit}_${search || ""}_${last_sync_time || ""}`;
	const cached = referenceCache.get<any>(cacheKey);
	if (cached) return cached;

	const skip = (page - 1) * limit;
	const where: any = { aktif: true };

	if (search) {
		where.name = { contains: search, mode: "insensitive" };
	}
	if (last_sync_time) {
		where.diperbarui_pada = { gt: new Date(last_sync_time) };
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

	const result = {
		data,
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit),
	};
	referenceCache.set(cacheKey, result);
	return result;
};

export const createDefect = async (data: {
	id_defect: string;
	name: string;
	category: kategori_defect_inspectra;
	deskripsi?: string;
	severity_default?: number;
}) => {
	const defect = await prisma.masterDefect.create({
		data: {
			id_defect: data.id_defect,
			name: data.name,
			category: data.category,
			deskripsi: data.deskripsi,
			severity_default: data.severity_default,
		},
	});
	invalidatePrefix(CACHE_KEYS.DEFECTS);
	return defect;
};

export const updateDefect = async (
	id_defect: string,
	data: Partial<{
		name: string;
		category: kategori_defect_inspectra;
		deskripsi: string;
		severity_default: number;
		aktif: boolean;
	}>,
) => {
	const defect = await prisma.masterDefect.update({
		where: { id_defect },
		data,
	});
	invalidatePrefix(CACHE_KEYS.DEFECTS);
	return defect;
};

export const deleteDefect = async (id_defect: string) => {
	const defect = await prisma.masterDefect.update({
		where: { id_defect },
		data: { aktif: false },
	});
	invalidatePrefix(CACHE_KEYS.DEFECTS);
	return defect;
};
