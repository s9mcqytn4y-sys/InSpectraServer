import { z } from "zod";

export const getDashboardQuerySchema = z.object({
	query: z.object({
		startDate: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
			.optional(),
		endDate: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
			.optional(),
		tipe_proses: z.string().optional(),
		top_n: z.string().regex(/^\d+$/).optional(),
		exportPdf: z.string().optional(),
	}),
});
