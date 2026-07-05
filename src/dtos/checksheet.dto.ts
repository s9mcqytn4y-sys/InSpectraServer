import { z } from "zod";

export const startSessionSchema = z.object({
	body: z.object({
		tipe_proses: z.string().min(1, "Tipe proses wajib diisi"),
		nama_shift: z.string().min(1, "Nama shift wajib diisi"),
		nama_operator: z.string().min(1, "Nama operator wajib diisi").optional(),
		nama_line: z.string().optional(),
		device_id: z.string().optional(),
		app_version: z.string().optional(),
	}),
});

export const submitDefectSchema = z.object({
	body: z.object({
		id_item: z.string().uuid("ID Item tidak valid (harus UUID)"),
		id_defect: z.string().min(1, "ID Defect wajib diisi"),
		nama_defect_snapshot: z.string().min(1, "Nama defect wajib diisi"),
		kategori: z.string().min(1, "Kategori wajib diisi"),
		jumlah: z.number().int().min(1, "Kuantitas minimal 1"),
		fotoUrl: z.string().optional(),
	}),
});

export const submitItemCheckSchema = z.object({
	body: z.object({
		id_sesi: z.string().uuid("ID Sesi tidak valid (harus UUID)"),
		uniq_no: z.string().min(1, "Uniq No Part wajib diisi"),
		jumlah_diperiksa: z.number().int().min(1, "Jumlah diperiksa minimal 1"),
		jumlah_ok: z.number().int().min(0, "Jumlah OK tidak boleh negatif"),
		jumlah_ng: z.number().int().min(0, "Jumlah NG tidak boleh negatif"),
		catatan: z.string().optional(),
	}),
});
