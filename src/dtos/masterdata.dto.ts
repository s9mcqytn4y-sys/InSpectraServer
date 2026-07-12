import { z } from "zod";

const TIPE_PROSES = [
	"PRESS",
	"SEWING",
	"CUTTING",
	"MATERIAL",
	"PASS_THROUGH",
	"CONSUMABLE",
	"PRESS_SPRAY",
	"PRESS_CUTTING",
	"PRESS_PRESS",
	"QUALITY_CONTROL",
] as const;

export const createPartSchema = z.object({
	body: z.object({
		uniqNo: z.string().min(1, "Nomor Unik (uniqNo) wajib diisi"),
		part_no: z.string().optional(),
		name: z.string().min(1, "Nama Part wajib diisi"),
		model: z.string().optional(),
		customer: z.string().optional(),
		commodity: z.enum(TIPE_PROSES, {
			message: "Komoditas (tipe proses) wajib diisi dan harus valid",
		}),
		aktif: z.boolean().optional().default(true),
		catatan: z.string().optional(),
		kode_internal: z.string().optional(),
	}),
});

export const updatePartSchema = z.object({
	body: z.object({
		part_no: z.string().optional(),
		name: z.string().min(1, "Nama Part wajib diisi").optional(),
		model: z.string().optional(),
		customer: z.string().optional(),
		commodity: z.enum(TIPE_PROSES).optional(),
		aktif: z.boolean().optional(),
		catatan: z.string().optional(),
		kode_internal: z.string().optional(),
	}),
	params: z.object({
		uniqNo: z.string().min(1, "UniqNo param wajib"),
	}),
});

export const createMaterialSchema = z.object({
	body: z.object({
		code: z.string().min(1, "Kode Material wajib diisi"),
		name: z.string().min(1, "Nama Material wajib diisi"),
		kategori_material: z.string().optional(),
		satuan: z.string().optional(),
		spec_ringkas: z.string().optional(),
		aktif: z.boolean().optional().default(true),
		supplier_id: z
			.string()
			.uuid("Format Supplier ID tidak valid (harus UUID)")
			.optional()
			.nullable(),
	}),
});

export const updateMaterialSchema = z.object({
	body: z.object({
		name: z.string().min(1, "Nama Material wajib diisi").optional(),
		kategori_material: z.string().optional(),
		satuan: z.string().optional(),
		spec_ringkas: z.string().optional(),
		aktif: z.boolean().optional(),
		supplier_id: z.string().uuid().optional().nullable(),
	}),
	params: z.object({
		code: z.string().min(1, "Code param wajib"),
	}),
});

export const createDefectSchema = z.object({
	body: z.object({
		id_defect: z.string().min(1, "ID Defect wajib diisi"),
		name: z.string().min(1, "Nama Defect wajib diisi"),
		category: z.enum(["MATERIAL", "PROSES"], {
			message: "Kategori harus MATERIAL atau PROSES",
		}),
		deskripsi: z.string().optional(),
		severity_default: z
			.number()
			.min(1, "Severity minimal 1")
			.max(5, "Severity maksimal 5")
			.optional(),
	}),
});

export const updateDefectSchema = z.object({
	body: z.object({
		name: z.string().min(1, "Nama Defect wajib diisi").optional(),
		category: z.enum(["MATERIAL", "PROSES"]).optional(),
		deskripsi: z.string().optional(),
		severity_default: z.number().min(1).max(5).optional(),
		aktif: z.boolean().optional(),
	}),
	params: z.object({
		id_defect: z.string().min(1, "id_defect param wajib"),
	}),
});

export const getMasterDataQuerySchema = z.object({
	query: z.object({
		page: z.string().regex(/^\d+$/).optional(),
		limit: z.string().regex(/^\d+$/).optional(),
		search: z.string().optional(),
	}),
});
