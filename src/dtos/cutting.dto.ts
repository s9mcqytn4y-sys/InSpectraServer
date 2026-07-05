import { z } from "zod";

export const createBatchSchema = z.object({
	body: z.object({
		id_sesi: z.string().uuid("ID Sesi tidak valid (harus UUID)"),
		material_id: z.string().uuid("ID Material tidak valid (harus UUID)"),
		no_lot_roll: z.string().optional(),
		no_roll: z.string().optional(),
		ukuran_cutting_cm: z.number().min(0).optional(),
		size_cutting_cm: z.number().min(0).optional(),
		qty_layer_ok: z.number().int().min(0, "Qty Layer OK minimal 0").default(0),
		qty_layer_ng: z.number().int().min(0, "Qty Layer NG minimal 0").default(0),
		waste_panjang_cm: z.number().min(0).default(0),
		pic: z.string().optional(),
		catatan: z.string().optional(),
	}),
});
