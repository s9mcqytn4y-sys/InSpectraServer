import type {
	kategori_defect_inspectra,
	tipe_proses_inspectra,
} from "@prisma/client";
import prisma from "../config/prisma";

export const getParts = async () => {
	// Frontend friendly: order by latest, select relevant fields
	return await prisma.masterPart.findMany({
		where: { aktif: true },
		orderBy: { dibuat_pada: "desc" },
	});
};

export const createPart = async (data: {
	uniqNo: string;
	part_no?: string;
	name: string;
	model?: string;
	customer?: string;
	commodity: tipe_proses_inspectra;
	aktif?: boolean;
	catatan?: string;
	kode_internal?: string;
}) => {
	return await prisma.masterPart.create({
		data: {
			uniqNo: data.uniqNo,
			part_no: data.part_no,
			name: data.name,
			model: data.model,
			customer: data.customer,
			commodity: data.commodity,
			aktif: data.aktif ?? true,
			catatan: data.catatan,
			kode_internal: data.kode_internal,
		},
	});
};

export const getMaterials = async () => {
	return await prisma.masterMaterial.findMany({
		where: { aktif: true },
		orderBy: { dibuat_pada: "desc" },
		include: { m_supplier: true },
	});
};

export const createMaterial = async (data: {
	code: string;
	name: string;
	kategori_material?: string;
	satuan?: any;
	spec_ringkas?: string;
	aktif?: boolean;
	supplier_id?: string | null;
}) => {
	return await prisma.masterMaterial.create({
		data: {
			code: data.code,
			name: data.name,
			kategori_material: data.kategori_material,
			satuan: data.satuan ?? "UNKNOWN",
			spec_ringkas: data.spec_ringkas,
			aktif: data.aktif ?? true,
			supplier_id: data.supplier_id,
		},
	});
};

export const getDefects = async () => {
	return await prisma.masterDefect.findMany({
		where: { aktif: true },
		orderBy: { dibuat_pada: "desc" },
	});
};

export const createDefect = async (data: {
	id_defect: string;
	name: string;
	category: kategori_defect_inspectra;
	deskripsi?: string;
	severity_default?: number;
}) => {
	return await prisma.masterDefect.create({
		data: {
			id_defect: data.id_defect,
			name: data.name,
			category: data.category,
			deskripsi: data.deskripsi,
			severity_default: data.severity_default,
		},
	});
};
