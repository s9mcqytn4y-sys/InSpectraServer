import { z } from "zod";

export const createLaporanSchema = z.object({
	body: z.object({
		tanggal: z.string().datetime("Format tanggal harus ISO 8601 (Datetime)"),
		tipe_proses: z.string().min(1, "Tipe Proses wajib diisi"),
		mp_direct: z.number().int().min(0).optional(),
		mp_indirect: z.number().int().min(0).optional(),
		jkn_hour: z.number().int().min(0).optional(),
		jkn_menit: z.number().int().min(0).optional(),
		ot_prod: z.number().min(0).optional(),
		ot_non: z.number().min(0).optional(),
	}),
});
