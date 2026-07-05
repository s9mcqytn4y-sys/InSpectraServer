import { z } from "zod";

export const createBatchSchema = z.object({
	body: z.object({
		id_sesi: z.string().uuid("Invalid session ID"),
		material_id: z.string().uuid("Invalid material ID"),
	}),
});
