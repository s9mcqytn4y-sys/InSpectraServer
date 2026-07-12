import type {
	kategori_defect_inspectra,
	tipe_proses_inspectra,
} from "@prisma/client";
import prisma from "../src/config/prisma";

// ============================================================================
// Helper: Upsert single dengan logging
// ============================================================================
async function upsertPart(data: {
	uniqNo: string;
	part_no?: string;
	name: string;
	commodity: tipe_proses_inspectra;
	model?: string;
	customer?: string;
	aktif?: boolean;
}) {
	const existing = await prisma.masterPart.findUnique({ where: { uniqNo: data.uniqNo } });
	if (existing) {
		return prisma.masterPart.update({
			where: { uniqNo: data.uniqNo },
			data: {
				part_no: data.part_no,
				name: data.name,
				commodity: data.commodity,
				model: data.model ?? null,
				customer: data.customer ?? null,
				aktif: data.aktif ?? true,
			},
		});
	}
	return prisma.masterPart.create({
		data: {
			uniqNo: data.uniqNo,
			part_no: data.part_no,
			name: data.name,
			commodity: data.commodity,
			model: data.model ?? null,
			customer: data.customer ?? null,
			aktif: data.aktif ?? true,
		},
	});
}

async function upsertDefect(data: {
	id_defect: string;
	name: string;
	category: kategori_defect_inspectra;
	deskripsi?: string;
	severity_default?: number;
}) {
	const existing = await prisma.masterDefect.findUnique({ where: { id_defect: data.id_defect } });
	if (existing) {
		return prisma.masterDefect.update({
			where: { id_defect: data.id_defect },
			data: { name: data.name, category: data.category, deskripsi: data.deskripsi, severity_default: data.severity_default },
		});
	}
	return prisma.masterDefect.create({ data });
}

// ============================================================================
// Main
// ============================================================================
async function main() {
	console.log("🌱 Mulai seeding data master produksi (InSpectraServer)...");

	// ========================================================================
	// 1. Seed Master Part — Data Produksi Nyata dari PARTLIST(16).xlsx
	// ========================================================================
	const parts: {
		uniqNo: string;
		part_no: string;
		name: string;
		commodity: tipe_proses_inspectra;
		model: string;
		customer: string;
	}[] = [
		// --- SEWING ---
		{ uniqNo: "BJ1", part_no: "79977-BZ020", name: "FELT SEAT BACK", commodity: "SEWING", model: "D26A", customer: "BONECOM TRICOM" },
		{ uniqNo: "B35", part_no: "71695-VT070-C", name: "PROTECTOR, RR SEAT BACK", commodity: "SEWING", model: "560B", customer: "BONECOM TRICOM" },
		{ uniqNo: "B63", part_no: "71695-VT080", name: "PROTECTOR, RR SEAT BACK", commodity: "SEWING", model: "560B", customer: "BONECOM TRICOM" },
		{ uniqNo: "B51", part_no: "71695-VT090-B", name: "PROTECTOR, RR SEAT BACK", commodity: "SEWING", model: "560B", customer: "BONECOM TRICOM" },
		{ uniqNo: "B70", part_no: "71695-VT100-B", name: "PROTECTOR, RR SEAT BACK", commodity: "SEWING", model: "560B", customer: "BONECOM TRICOM" },
		{ uniqNo: "B55", part_no: "71695-VT110-D", name: "PROTECTOR, RR SEAT BACK", commodity: "SEWING", model: "560B", customer: "BONECOM TRICOM" },
		{ uniqNo: "B72", part_no: "71695-VT120-D", name: "PROTECTOR, RR SEAT BACK", commodity: "SEWING", model: "560B", customer: "BONECOM TRICOM" },
		// --- Sewing (Seat Back Assy dari Gambar 1) ---
		{ uniqNo: "71702-VT020-C0", part_no: "71702-VT020-C0", name: "BOARD SUB ASSY RR SEAT BACK LH", commodity: "SEWING", model: "560B", customer: "BONECOM TRICOM" },
		{ uniqNo: "71701-VT020-C0", part_no: "71701-VT020-C0", name: "BOARD SUB ASSY RR SEAT BACK RH", commodity: "SEWING", model: "560B", customer: "BONECOM TRICOM" },
		// --- PRESS ---
		{ uniqNo: "CB9", part_no: "58815-KK010-00", name: "CARPET CONSOLE BOX", commodity: "PRESS", model: "660A", customer: "BONECOM TRICOM" },
		{ uniqNo: "CB3", part_no: "58612-A1016", name: "PAD FR DOOR SILENCER", commodity: "PRESS", model: "650A", customer: "BONECOM TRICOM" },
		{ uniqNo: "ER2", part_no: "67812-X7A07", name: "PAD FR DOOR SILENCER (ER2)", commodity: "PRESS", model: "650A", customer: "BONECOM TRICOM" },
		{ uniqNo: "MM1", part_no: "58611-A1011", name: "INSULATION SHEET NO. 1", commodity: "PRESS", model: "660A/650", customer: "BONECOM TRICOM" },
		{ uniqNo: "ML0", part_no: "58611-A1012", name: "INSULATION SHEET NO. 2", commodity: "PRESS", model: "660A/650", customer: "BONECOM TRICOM" },
		{ uniqNo: "FP7", part_no: "11127-A1042", name: "FELT FR RH", commodity: "PRESS", model: "650A", customer: "BONECOM TRICOM" },
		{ uniqNo: "FP8", part_no: "12127-A1042", name: "FELT FR LH", commodity: "PRESS", model: "650A", customer: "BONECOM TRICOM" },
		{ uniqNo: "FP9", part_no: "13115-A1042", name: "FELT (40%)", commodity: "PRESS", model: "650A", customer: "BONECOM TRICOM" },
		{ uniqNo: "FQ0", part_no: "14137-A1044", name: "FELT 60%", commodity: "PRESS", model: "650A", customer: "BONECOM TRICOM" },
		{ uniqNo: "FJ0", part_no: "71075-F1V01", name: "PAD SETTEN RH", commodity: "PRESS", model: "D14N", customer: "BONECOM TRICOM" },
		{ uniqNo: "FJ1", part_no: "71075-F1V02", name: "PAD SETTEN LH", commodity: "PRESS", model: "D14N", customer: "BONECOM TRICOM" },
		{ uniqNo: "FJ2", part_no: "71075-F1V03", name: "USHIRO RH", commodity: "PRESS", model: "D14N", customer: "BONECOM TRICOM" },
		{ uniqNo: "FJ3", part_no: "71075-F1V04", name: "USHIRO LH", commodity: "PRESS", model: "D14N", customer: "BONECOM TRICOM" },
		{ uniqNo: "FJ4", part_no: "71075-F1V05", name: "BOTTOM RH", commodity: "PRESS", model: "D14N", customer: "BONECOM TRICOM" },
		{ uniqNo: "FJ5", part_no: "71075-F1V06", name: "BOTTOM LH", commodity: "PRESS", model: "D14N", customer: "BONECOM TRICOM" },
		{ uniqNo: "FJ6", part_no: "71075-F1V07", name: "KOTAK USHIRO", commodity: "PRESS", model: "D14N", customer: "BONECOM TRICOM" },
		{ uniqNo: "BM7", part_no: "71651-BZ020", name: "PAD RR SEAT BACK RH", commodity: "PRESS", model: "GSK", customer: "BONECOM TRICOM" },
		{ uniqNo: "BM8", part_no: "71652-BZ020", name: "PAD RR SEAT BACK LH", commodity: "PRESS", model: "GSK", customer: "BONECOM TRICOM" },
		{ uniqNo: "DN5", part_no: "11115-A1012", name: "FELT FRONT BACK RH (LOW-G)", commodity: "PRESS", model: "660A", customer: "BONECOM TRICOM" },
		{ uniqNo: "BY4", part_no: "12115-A1012", name: "FELT FRONT BACK LH (LOW-G)", commodity: "PRESS", model: "660A", customer: "BONECOM TRICOM" },
		{ uniqNo: "BT136", part_no: "11101-A1211-00", name: "FELT FRONT BACK RH", commodity: "PRESS", model: "560B", customer: "BONECOM TRICOM" },
		{ uniqNo: "BT137", part_no: "11102-A1211-00", name: "FELT FRONT BACK RH (BT137)", commodity: "PRESS", model: "560B", customer: "BONECOM TRICOM" },
		{ uniqNo: "BT144", part_no: "12101-A1211-00", name: "FELT FRONT BACK LH", commodity: "PRESS", model: "560B", customer: "BONECOM TRICOM" },
		{ uniqNo: "BT200", part_no: "13119-A1212", name: "FELT BENCH 6:4", commodity: "PRESS", model: "560B", customer: "BONECOM TRICOM" },
		{ uniqNo: "BT201", part_no: "13120-A1212", name: "FELT 60%", commodity: "PRESS", model: "560B", customer: "BONECOM TRICOM" },
		{ uniqNo: "BT202", part_no: "13121-A1212", name: "FELT 40%", commodity: "PRESS", model: "560B", customer: "BONECOM TRICOM" },
		{ uniqNo: "BT203", part_no: "13122-A1212", name: "FELT 24*188", commodity: "PRESS", model: "560B", customer: "BONECOM TRICOM" },
		{ uniqNo: "EQ5", part_no: "79117-0K060-A", name: "CARPET NO. 1 SEAT CUSHION", commodity: "PRESS", model: "650A", customer: "BONECOM TRICOM" },
		// --- Dummy (dipertahankan untuk testing) ---
		{ uniqNo: "PR-001", part_no: "PART-1001", name: "Bemper Depan (Front Bumper Bracket)", commodity: "PRESS", model: "MODEL-X", customer: "CUSTOMER-A" },
		{ uniqNo: "PR-002", part_no: "PART-1002", name: "Subframe Belakang (Rear Subframe)", commodity: "PRESS", model: "MODEL-Y", customer: "CUSTOMER-B" },
		{ uniqNo: "CT-001", part_no: "PART-2001", name: "Fabric Jok Depan", commodity: "CUTTING", model: "MODEL-Z", customer: "CUSTOMER-C" },
	];

	for (const part of parts) {
		await upsertPart(part);
	}
	console.log(`✅ Seeded ${parts.length} Master Parts.`);

	// ========================================================================
	// 2. Seed Master Defect — Data Nyata Operasional Pabrik
	// ========================================================================
	const defects: {
		id_defect: string;
		name: string;
		category: kategori_defect_inspectra;
		deskripsi?: string;
	}[] = [
		// Sewing Defects
		{ id_defect: "SEWING_PUTUS", name: "Sewing Putus", category: "PROSES", deskripsi: "Benang jahit putus di tengah jalur jahitan." },
		{ id_defect: "SEWING_LONCAT", name: "Sewing Loncat", category: "PROSES", deskripsi: "Jahitan meloncat/skip sehingga tidak membentuk kunci benang." },
		{ id_defect: "SEWING_LONGGAR", name: "Sewing Longgar", category: "PROSES", deskripsi: "Tegangan benang terlalu lemah sehingga jahitan kendur." },
		{ id_defect: "SEWING_MIRING", name: "Sewing Miring", category: "PROSES", deskripsi: "Jalur jahitan tidak sesuai pola/gambar kerja." },
		{ id_defect: "SEWING_NITIK", name: "Sewing Nitik", category: "PROSES", deskripsi: "Jahitan terlalu rapat/menumpuk di satu titik." },
		{ id_defect: "KUNCIAN_JEBOL", name: "Kuncian Jebol", category: "PROSES", deskripsi: "Kuncian benang awal/akhir jahitan tidak terbentuk sempurna." },
		{ id_defect: "LANGKAH_SEWING_TIDAK_SESUAI", name: "Langkah Sewing Tidak Sesuai", category: "PROSES", deskripsi: "Panjang stitch tidak memenuhi standar (misal: 3-4 stitch/cm)." },
		{ id_defect: "ALUR_SERAT_TIDAK_SESUAI", name: "Alur Serat Tidak Sesuai", category: "PROSES", deskripsi: "Arah serat material tidak mengikuti arah yang ditentukan gambar." },
		// Material Defects
		{ id_defect: "BELANG", name: "Belang", category: "MATERIAL", deskripsi: "Warna material tidak merata/terdapat bercak warna berbeda." },
		{ id_defect: "BERJAMUR", name: "Berjamur", category: "MATERIAL", deskripsi: "Terdapat jamur pada permukaan material." },
		{ id_defect: "BERLUBANG", name: "Berlubang", category: "MATERIAL", deskripsi: "Terdapat lubang/bolong pada material mentah." },
		{ id_defect: "BRUDUL", name: "Brudul", category: "MATERIAL", deskripsi: "Permukaan material terurai/berjumbai." },
		{ id_defect: "CACAT_MATERIAL", name: "Cacat Material", category: "MATERIAL", deskripsi: "Cacat umum pada material yang tidak terklasifikasi." },
		{ id_defect: "DENT", name: "Dent (Penyok)", category: "PROSES", deskripsi: "Penyok akibat benturan selama proses atau handling." },
		{ id_defect: "DIMENSI_TIDAK_STANDAR", name: "Dimensi Tidak Standar", category: "PROSES", deskripsi: "Ukuran dimensi (panjang/lebar/tebal) di luar toleransi." },
		{ id_defect: "GALER", name: "Galer", category: "MATERIAL", deskripsi: "Permukaan material mengelupas/tergelupas." },
		{ id_defect: "HOLE_T_A", name: "Hole T/A (Lubang Press)", category: "PROSES", deskripsi: "Lubang akibat proses press tidak sesuai posisi atau dimensi." },
		{ id_defect: "KOTOR", name: "Kotor / Noda", category: "MATERIAL", deskripsi: "Terdapat noda oli, debu, atau kotoran lain." },
		{ id_defect: "LAMINATING_BOLONG", name: "Laminating Bolong", category: "MATERIAL", deskripsi: "Lapisan laminasi berlubang." },
		{ id_defect: "LAMINATING_TIDAK_MATANG", name: "Laminating Tidak Matang", category: "MATERIAL", deskripsi: "Laminasi tidak merekat sempurna/masih ada bagian yang mengembang." },
		{ id_defect: "MENGEMBANG", name: "Mengembang", category: "MATERIAL", deskripsi: "Material menggembung tidak sesuai bentuk standar." },
		{ id_defect: "OVER_CUTTING", name: "Over Cutting", category: "PROSES", deskripsi: "Pemotongan melebihi garis potong yang ditentukan." },
		{ id_defect: "SOBEK", name: "Sobek", category: "MATERIAL", deskripsi: "Material robek/sobek." },
		{ id_defect: "SPUNBOND_KOTOR", name: "Spunbond Kotor", category: "MATERIAL", deskripsi: "Lapisan spunbond terkontaminasi kotoran." },
		{ id_defect: "SPUNBOND_MENGERAS", name: "Spunbond Mengeras", category: "MATERIAL", deskripsi: "Spunbond kaku/mengeras tidak sesuai standar kelenturan." },
		{ id_defect: "SPUNBOND_TERLIPAT", name: "Spunbond Terlipat", category: "MATERIAL", deskripsi: "Lapisan spunbond terlipat sebelum atau saat laminasi." },
		{ id_defect: "SPUNBOND_TIDAK_MEREKAT", name: "Spunbond Tidak Merekat", category: "MATERIAL", deskripsi: "Spunbond tidak melekat pada base material." },
		{ id_defect: "TERBALIK", name: "Terbalik", category: "PROSES", deskripsi: "Part terpasang/terorientasi terbalik dari posisi standar." },
		{ id_defect: "TERLIPAT", name: "Terlipat", category: "MATERIAL", deskripsi: "Material terlipat sehingga menyebabkan kerutan permanen." },
		{ id_defect: "TIPIS", name: "Tipis", category: "MATERIAL", deskripsi: "Ketebalan material di bawah toleransi minimum." },
		// Defect dummy lama (dipertahankan)
		{ id_defect: "D01", name: "Goresan Dalam (Scratch)", category: "PROSES", deskripsi: "Goresan yang menembus lapisan pelindung dasar." },
		{ id_defect: "D02", name: "Penyok (Dent)", category: "PROSES", deskripsi: "Penyok karena benturan alat berat." },
		{ id_defect: "D03", name: "Karat (Rust)", category: "MATERIAL", deskripsi: "Oksidasi atau karat pada material mentah." },
		{ id_defect: "D04", name: "Noda Kotor (Stain)", category: "MATERIAL", deskripsi: "Noda minyak atau debu pada fabric." },
		{ id_defect: "D05", name: "Lubang Meleset (Missing Hole)", category: "PROSES", deskripsi: "Proses punching tidak melubangi area yang tepat." },
	];

	for (const defect of defects) {
		await upsertDefect(defect);
	}
	console.log(`✅ Seeded ${defects.length} Master Defects.`);

	// ========================================================================
	// 3. Seed m_part_defect — Mapping Strict Part → Defect
	//    Berdasarkan analisis material komposisi dari Supabase migration
	// ========================================================================

	// Mapping: uniq_no → daftar id_defect yang relevan
	const partDefectMappings: { uniqNo: string; defects: string[] }[] = [
		// SEWING Parts — Defect berbasis proses sewing & material protector
		{
			uniqNo: "BJ1",
			defects: [
				"SEWING_PUTUS", "SEWING_LONCAT", "SEWING_LONGGAR", "SEWING_MIRING",
				"KUNCIAN_JEBOL", "LAMINATING_BOLONG", "LAMINATING_TIDAK_MATANG",
				"SPUNBOND_KOTOR", "SPUNBOND_MENGERAS", "SPUNBOND_TERLIPAT", "BRUDUL", "SOBEK",
			],
		},
		{
			uniqNo: "B35",
			defects: [
				"SEWING_PUTUS", "SEWING_LONCAT", "SEWING_LONGGAR", "SEWING_MIRING", "SEWING_NITIK",
				"KUNCIAN_JEBOL", "LAMINATING_BOLONG", "LAMINATING_TIDAK_MATANG",
				"SPUNBOND_KOTOR", "SPUNBOND_MENGERAS", "BRUDUL", "SOBEK", "TERLIPAT",
			],
		},
		{
			uniqNo: "B63",
			defects: [
				"SEWING_PUTUS", "SEWING_LONCAT", "SEWING_LONGGAR", "KUNCIAN_JEBOL",
				"LAMINATING_BOLONG", "LAMINATING_TIDAK_MATANG", "SPUNBOND_KOTOR", "BRUDUL", "SOBEK",
			],
		},
		{
			uniqNo: "B51",
			defects: [
				"SEWING_PUTUS", "SEWING_LONCAT", "KUNCIAN_JEBOL",
				"LAMINATING_BOLONG", "LAMINATING_TIDAK_MATANG", "SPUNBOND_KOTOR", "BRUDUL",
			],
		},
		{
			uniqNo: "B70",
			defects: [
				"SEWING_PUTUS", "SEWING_LONCAT", "KUNCIAN_JEBOL", "LANGKAH_SEWING_TIDAK_SESUAI",
				"LAMINATING_BOLONG", "LAMINATING_TIDAK_MATANG", "SPUNBOND_TERLIPAT", "BRUDUL",
			],
		},
		{
			uniqNo: "B55",
			defects: [
				"SEWING_PUTUS", "SEWING_MIRING", "KUNCIAN_JEBOL",
				"LAMINATING_BOLONG", "SPUNBOND_KOTOR", "BRUDUL", "SOBEK",
			],
		},
		{
			uniqNo: "B72",
			defects: [
				"SEWING_PUTUS", "SEWING_LONCAT", "KUNCIAN_JEBOL",
				"LAMINATING_BOLONG", "LAMINATING_TIDAK_MATANG", "SPUNBOND_TIDAK_MEREKAT", "BRUDUL",
			],
		},
		{
			uniqNo: "71702-VT020-C0",
			defects: [
				"SEWING_PUTUS", "SEWING_JEBOL", "CARPET_BERGELOMBANG",
				"SEWING_LONCAT", "KUNCIAN_JEBOL", "LAMINATING_BOLONG",
			],
		},
		{
			uniqNo: "71701-VT020-C0",
			defects: [
				"SEWING_PUTUS", "SEWING_JEBOL", "CARPET_BERGELOMBANG",
				"SEWING_LONCAT", "KUNCIAN_JEBOL", "LAMINATING_BOLONG",
			],
		},
		// PRESS Parts — Defect berbasis proses press & material felt/silencer
		{
			uniqNo: "CB9",
			defects: ["BELANG", "BERJAMUR", "BRUDUL", "DENT", "GALER", "SOBEK", "TERLIPAT", "TIPIS"],
		},
		{
			uniqNo: "CB3",
			defects: ["BRUDUL", "KOTOR", "SOBEK", "MENGEMBANG", "BERLUBANG", "TIPIS"],
		},
		{
			uniqNo: "ER2",
			defects: ["BRUDUL", "KOTOR", "SOBEK", "MENGEMBANG", "BERLUBANG"],
		},
		{
			uniqNo: "MM1",
			defects: ["BERLUBANG", "TIPIS", "SOBEK", "KOTOR", "DIMENSI_TIDAK_STANDAR"],
		},
		{
			uniqNo: "ML0",
			defects: ["BERLUBANG", "TIPIS", "SOBEK", "KOTOR", "DIMENSI_TIDAK_STANDAR"],
		},
		{
			uniqNo: "FP7",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "TERLIPAT", "KOTOR"],
		},
		{
			uniqNo: "FP8",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "TERLIPAT", "KOTOR"],
		},
		{
			uniqNo: "FP9",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "KOTOR"],
		},
		{
			uniqNo: "FQ0",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "KOTOR"],
		},
		{
			uniqNo: "FJ0",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "TERLIPAT", "LAMINATING_BOLONG"],
		},
		{
			uniqNo: "FJ1",
			defects: [
				"BRUDUL", "SOBEK", "TIPIS", "TERLIPAT", "LAMINATING_BOLONG",
				"LAMINATING_TIDAK_MATANG", "DIMENSI_TIDAK_STANDAR",
			],
		},
		{
			uniqNo: "FJ2",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "LAMINATING_BOLONG"],
		},
		{
			uniqNo: "FJ3",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "LAMINATING_BOLONG"],
		},
		{
			uniqNo: "FJ4",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "LAMINATING_BOLONG"],
		},
		{
			uniqNo: "FJ5",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "LAMINATING_BOLONG"],
		},
		{
			uniqNo: "FJ6",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "HOLE_T_A"],
		},
		{
			uniqNo: "BM7",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "LAMINATING_BOLONG", "LAMINATING_TIDAK_MATANG"],
		},
		{
			uniqNo: "BM8",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "LAMINATING_BOLONG", "LAMINATING_TIDAK_MATANG"],
		},
		{
			uniqNo: "BT136",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "TERLIPAT"],
		},
		{
			uniqNo: "BT137",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "TERLIPAT"],
		},
		{
			uniqNo: "BT144",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "TERLIPAT"],
		},
		{
			uniqNo: "DN5",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "TERLIPAT"],
		},
		{
			uniqNo: "BY4",
			defects: ["BRUDUL", "SOBEK", "TIPIS", "TERLIPAT"],
		},
		{
			uniqNo: "EQ5",
			defects: ["BELANG", "BERJAMUR", "BRUDUL", "DENT", "KOTOR", "SOBEK", "TERLIPAT"],
		},
		// Dummy parts
		{
			uniqNo: "PR-001",
			defects: ["D01", "D02", "D03", "D04", "D05"],
		},
		{
			uniqNo: "PR-002",
			defects: ["D01", "D02", "D03"],
		},
		{
			uniqNo: "CT-001",
			defects: ["D04", "OVER_CUTTING", "LAMINATING_BOLONG"],
		},
	];

	// Upsert m_part_defect — hanya defect yang sudah ada di DB
	let mappingCount = 0;
	for (const pm of partDefectMappings) {
		// Cek apakah part ada
		const partExists = await prisma.masterPart.findUnique({
			where: { uniqNo: pm.uniqNo },
			select: { uniqNo: true },
		});
		if (!partExists) continue;

		for (let i = 0; i < pm.defects.length; i++) {
			const defectId = pm.defects[i];
			// Cek apakah defect ada
			const defectExists = await prisma.masterDefect.findUnique({
				where: { id_defect: defectId },
				select: { id_defect: true },
			});
			if (!defectExists) continue;

			try {
				// Cek apakah mapping sudah ada secara manual
				const existingMapping = await prisma.m_part_defect.findFirst({
					where: { uniq_no: pm.uniqNo, id_defect: defectId }
				});

				if (existingMapping) {
					await prisma.m_part_defect.update({
						where: { id: existingMapping.id },
						data: { urutan: i + 1, aktif: true }
					});
				} else {
					await prisma.m_part_defect.create({
						data: {
							uniq_no: pm.uniqNo,
							id_defect: defectId,
							urutan: i + 1,
							aktif: true,
						},
					});
				}
				mappingCount++;
			} catch (err) {
				console.error(`Error mapping ${pm.uniqNo}:${defectId}`, err);
			}
		}
	}
	console.log(`✅ Seeded ${mappingCount} Part-Defect Mappings.`);

	// ========================================================================
	// 4. Seed Slot Waktu — 4 Slot per Proses (SLOT_1, SLOT_2, SLOT_3, OVERTIME)
	// ========================================================================
	const processes: tipe_proses_inspectra[] = ["PRESS", "CUTTING", "SEWING", "QUALITY_CONTROL"];
	const slotDefinitions = [
		{ name: "SLOT_1", label: "08:00 - 12:00", urutan: 1 },
		{ name: "SLOT_2", label: "13:00 - 15:30", urutan: 2 },
		{ name: "SLOT_3", label: "16:00 - 17:00", urutan: 3 },
		{ name: "OVERTIME", label: "17:00 - Selesai", urutan: 4 },
	];

	for (const proses of processes) {
		for (const def of slotDefinitions) {
			const kode_slot = `${proses}_SHIFT_1_${def.name}`;
			const existing = await prisma.m_slot_waktu.findUnique({ where: { kode_slot: kode_slot } });
			if (existing) {
				await prisma.m_slot_waktu.update({
					where: { kode_slot: kode_slot },
					data: { label_waktu: def.label, urutan: def.urutan, aktif: true },
				});
			} else {
				await prisma.m_slot_waktu.create({
					data: {
						kode_slot: kode_slot,
						tipe_proses: proses,
						nama_shift: "SHIFT_1",
						label_waktu: def.label,
						urutan: def.urutan,
						aktif: true,
					},
				});
			}
		}
	}
	console.log("✅ Seeded 16 Slot Waktu (4 proses × 4 slot).");

	// ========================================================================
	// 5. Seed Material — Normalized dari Supabase Migration
	// ========================================================================
	const materials = [
		{ code: "MAT-FELT-01", name: "FELT 600GSM BLACK", kategori_material: "FELT", satuan: "ROLL" as any, spec_ringkas: "600gsm x 120cm" },
		{ code: "MAT-FELT-02", name: "FELT 400GSM GREY", kategori_material: "FELT", satuan: "ROLL" as any, spec_ringkas: "400gsm x 120cm" },
		{ code: "MAT-SIL-01", name: "SILENCER PAD 2MM", kategori_material: "SILENCER", satuan: "LEMBAR" as any, spec_ringkas: "2mm x 100cm x 100cm" },
		{ code: "MAT-SPB-01", name: "SPUNBOND 50GSM WHITE", kategori_material: "SPUNBOND", satuan: "ROLL" as any, spec_ringkas: "50gsm x 160cm" },
	];
	for (const m of materials) {
		const existing = await prisma.masterMaterial.findUnique({ where: { code: m.code } });
		if (existing) {
			await prisma.masterMaterial.update({
				where: { code: m.code },
				data: {
					name: m.name,
					kategori_material: m.kategori_material,
					satuan: m.satuan,
					spec_ringkas: m.spec_ringkas,
					aktif: true
				},
			});
		} else {
			await prisma.masterMaterial.create({ data: m });
		}
	}
	console.log(`✅ Seeded ${materials.length} Master Materials.`);

	// ========================================================================
	// 6. Seed Master Karyawan (Dummy untuk Testing)
	// ========================================================================
	const employees = [
		{ no_reg: "REG001", nama_lengkap: "Budi Santoso", tipe_pekerja: "KARYAWAN" as any, line_process: "PRESS" as any },
		{ no_reg: "REG002", nama_lengkap: "Siti Aminah", tipe_pekerja: "KARYAWAN" as any, line_process: "SEWING" as any },
		{ no_reg: "REG003", nama_lengkap: "Agus Prayitno", tipe_pekerja: "PKL" as any, line_process: "CUTTING" as any },
	];

	for (const emp of employees) {
		const existing = await prisma.masterEmployee.findUnique({ where: { no_reg: emp.no_reg } });
		if (existing) {
			await prisma.masterEmployee.update({
				where: { no_reg: emp.no_reg },
				data: { nama_lengkap: emp.nama_lengkap, aktif: true },
			});
		} else {
			await prisma.masterEmployee.create({ data: emp });
		}
	}
	console.log(`✅ Seeded ${employees.length} Master Karyawan.`);

	// ========================================================================
	// 7. Seed BOM / Material Composition (m_part_child)
	// ========================================================================
	const partChildren = [
		{ parent_uniq_no: "71702-VT020-C0", child_uniq_no: "BJ1" },
		{ parent_uniq_no: "71701-VT020-C0", child_uniq_no: "B35" },
	];
	for (const pc of partChildren) {
		const existing = await prisma.m_part_child.findFirst({
			where: { parent_uniq_no: pc.parent_uniq_no, child_uniq_no: pc.child_uniq_no }
		});
		if (!existing) {
			await prisma.m_part_child.create({ data: pc });
		}
	}
	console.log(`✅ Seeded ${partChildren.length} Part Children (BOM).`);

	// ========================================================================
	// 8. Seed Cutting Size Reference (m_part_cutting_size_reference)
	// ========================================================================
	const cuttingSizeRefs = [
		{ uniq_no: "CT-001", size_cutting_cm: 120.0, urutan: 1 },
		{ uniq_no: "CT-001", size_cutting_cm: 60.0, urutan: 2 },
	];
	for (const csr of cuttingSizeRefs) {
		const existing = await prisma.m_part_cutting_size_reference.findFirst({
			where: { uniq_no: csr.uniq_no, size_cutting_cm: csr.size_cutting_cm }
		});
		if (existing) {
			await prisma.m_part_cutting_size_reference.update({
				where: { id: existing.id },
				data: csr,
			});
		} else {
			await prisma.m_part_cutting_size_reference.create({ data: csr });
		}
	}
	console.log(`✅ Seeded ${cuttingSizeRefs.length} Cutting Size References.`);

	// ========================================================================
	// 9. Seed Pareto (Dummy Transaction Data for UI/UX Mocking)
	// ========================================================================
	const SESSION_ID = "00000000-0000-0000-0000-000000000001";
	const ITEM_ID = "00000000-0000-0000-0000-000000000011";

	const existingSession = await prisma.checksheetSession.findUnique({ where: { id: SESSION_ID } });
	if (!existingSession) {
		await prisma.checksheetSession.create({
			data: {
				id: SESSION_ID,
				kode_sesi: "SESI-SEED-01",
				tipe_proses: "PRESS",
				tanggal_pemeriksaan: new Date(),
				total_diperiksa: 500,
				totalOk: 410,
				totalNg: 90,
			}
		});
		
		await prisma.e_item_checksheet.create({
			data: {
				id: ITEM_ID,
				id_sesi: SESSION_ID,
				uniq_no: "PR-001",
				jumlah_diperiksa: 500,
				jumlah_ok: 410,
				jumlah_ng: 90,
			}
		});

		await prisma.e_defect_checksheet.createMany({
			data: [
				{ id_item: ITEM_ID, id_defect: "D01", nama_defect_snapshot: "Goresan Dalam (Scratch)", kategori: "PROSES", jumlah: 15 },
				{ id_item: ITEM_ID, id_defect: "D02", nama_defect_snapshot: "Penyok (Dent)", kategori: "PROSES", jumlah: 42 },
				{ id_item: ITEM_ID, id_defect: "D03", nama_defect_snapshot: "Karat (Rust)", kategori: "MATERIAL", jumlah: 8 },
				{ id_item: ITEM_ID, id_defect: "D04", nama_defect_snapshot: "Noda Kotor (Stain)", kategori: "MATERIAL", jumlah: 20 },
				{ id_item: ITEM_ID, id_defect: "D05", nama_defect_snapshot: "Lubang Meleset (Missing Hole)", kategori: "PROSES", jumlah: 5 },
			]
		});
		console.log("✅ Seeded Dummy Pareto Transaction Data.");
	} else {
		console.log("✅ Dummy Pareto Transaction Data already exists.");
	}

	console.log("\n🎉 Seeding selesai!");
}

main()
	.catch((e) => {
		console.error("❌ Error saat seeding:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
