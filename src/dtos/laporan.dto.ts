import { z } from "zod";

export const createLaporanSchema = z.object({
	body: z.object({
		tanggal: z.string().datetime(),
		tipe_proses: z.string().min(1, "Tipe Proses is required"),
	}),
});
