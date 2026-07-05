import { z } from "zod";

export const createPartSchema = z.object({
	body: z.object({
		uniqNo: z.string().min(1, "Uniq No is required"),
		name: z.string().min(1, "Name is required"),
		model: z.string().optional(),
		commodity: z.string().min(1, "Commodity is required"),
	}),
});

export const createMaterialSchema = z.object({
	body: z.object({
		code: z.string().min(1, "Code is required"),
		name: z.string().min(1, "Name is required"),
		supplierId: z.string().uuid("Invalid supplier ID").optional(),
	}),
});
