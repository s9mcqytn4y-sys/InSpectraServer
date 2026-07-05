import { z } from "zod";

export const createEmployeeSchema = z.object({
	body: z.object({
		nama_lengkap: z.string().min(1, "Nama Lengkap is required"),
		tipe_pekerja: z.string().min(1, "Tipe Pekerja is required"),
		line_process: z.string().min(1, "Line Process is required"),
		no_reg: z.string().optional(),
	}),
});
