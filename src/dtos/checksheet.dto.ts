import { z } from "zod";

export const startSessionSchema = z.object({
	body: z.object({
		tipe_proses: z.string().min(1, "Tipe proses is required"),
		nama_shift: z.string().min(1, "Shift is required"),
		nama_operator: z.string().min(1, "Operator is required"),
	}),
});

export const submitDefectSchema = z.object({
	body: z.object({
		sessionId: z.string().uuid("Invalid session ID"),
		defectId: z.string().min(1, "Invalid defect ID"),
		quantity: z.number().int().min(1),
	}),
});
