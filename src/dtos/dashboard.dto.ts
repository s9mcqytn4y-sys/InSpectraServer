import { z } from "zod";

export const getDashboardQuerySchema = z.object({
	query: z.object({
		startDate: z.string().datetime({ offset: true }).optional(),
		endDate: z.string().datetime({ offset: true }).optional(),
		tipe_proses: z.string().optional(),
	}),
});
