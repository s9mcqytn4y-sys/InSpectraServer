import { z } from "zod";

export const submitLaporanHarianSchema = z.object({
	body: z.object({
		tanggal: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
		tipe_proses: z.string().min(1, "Tipe Proses wajib diisi"),
		mp_direct: z.number().int().min(0).optional(),
		mp_indirect: z.number().int().min(0).optional(),
		jkn_hour: z.number().int().min(0).optional(),
		jkn_menit: z.number().int().min(0).optional(),
		ot_prod: z.number().min(0).optional(),
		ot_non: z.number().min(0).optional(),
		bantuan_keluar: z.number().int().min(0).optional(),
		bantuan_masuk: z.number().int().min(0).optional(),
		details: z
			.array(
				z.object({
					id_part: z.string().uuid("ID Part tidak valid (harus UUID)"),
					planning: z.number().int().min(0).default(0),
					actual: z.number().int().min(0).default(0),
					ng: z.number().int().min(0).default(0),
				}),
			)
			.min(1, "Minimal harus ada 1 detail part"),
	}),
});

export const getLaporanQuerySchema = z.object({
	query: z.object({
		page: z.string().regex(/^\d+$/).optional(),
		limit: z.string().regex(/^\d+$/).optional(),
		search: z.string().optional(),
		startDate: z.string().datetime().optional(),
		endDate: z.string().datetime().optional(),
		exportPdf: z.string().optional(),
	}),
});
