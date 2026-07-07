import type {
	kategori_defect_inspectra,
	tipe_proses_inspectra,
} from "@prisma/client";
import prisma from "../src/config/prisma";

async function main() {
	console.log("Mulai melakukan seeding data (Bahasa Indonesia)...");

	// 1. Seed Master Part
	const parts = [
		{
			uniqNo: "PR-001",
			part_no: "PART-1001",
			name: "Bemper Depan (Front Bumper Bracket)",
			commodity: "PRESS" as tipe_proses_inspectra,
			model: "MODEL-X",
			customer: "CUSTOMER-A",
			kode_internal: "INT-PR-001",
			catatan: "Part rawan defect scratch di area ujung.",
			aktif: true,
		},
		{
			uniqNo: "PR-002",
			part_no: "PART-1002",
			name: "Subframe Belakang (Rear Subframe)",
			commodity: "PRESS" as tipe_proses_inspectra,
			model: "MODEL-Y",
			customer: "CUSTOMER-B",
			kode_internal: "INT-PR-002",
			catatan: "Perlu pengecekan karat (rust) pada bagian pengelasan.",
			aktif: true,
		},
		{
			uniqNo: "CT-001",
			part_no: "PART-2001",
			name: "Fabric Jok Depan",
			commodity: "CUTTING" as tipe_proses_inspectra,
			model: "MODEL-Z",
			customer: "CUSTOMER-C",
			kode_internal: "INT-CT-001",
			catatan: "Bahan sangat sensitif terhadap noda kotoran.",
			aktif: true,
		},
	];

	for (const part of parts) {
		await prisma.masterPart.upsert({
			where: { uniqNo: part.uniqNo },
			update: {},
			create: part,
		});
	}
	console.log("Seeded Master Parts.");

	// 2. Seed Master Material (Kain/Besi dll)
	const materials = [
		{
			code: "MAT-001",
			name: "Plat Besi SPCC",
			kategori_material: "LOGAM",
			satuan: "KG" as any,
			aktif: true,
			spec_ringkas: "Tebal 1.2mm",
		},
		{
			code: "MAT-002",
			name: "Kain Sintetis PVC",
			kategori_material: "FABRIC",
			satuan: "ROLL" as any,
			aktif: true,
			spec_ringkas: "Warna Hitam",
		},
	];

	for (const material of materials) {
		await prisma.masterMaterial.upsert({
			where: { code: material.code },
			update: {},
			create: material,
		});
	}
	console.log("Seeded Master Materials.");

	// 3. Seed Master Defect
	const defects = [
		{
			id_defect: "D01",
			name: "Goresan Dalam (Scratch)",
			category: "PROSES" as kategori_defect_inspectra,
			deskripsi: "Goresan yang menembus lapisan pelindung dasar.",
			severity_default: 3,
		},
		{
			id_defect: "D02",
			name: "Penyok (Dent)",
			category: "PROSES" as kategori_defect_inspectra,
			deskripsi: "Penyok karena benturan alat berat.",
			severity_default: 2,
		},
		{
			id_defect: "D03",
			name: "Karat (Rust)",
			category: "MATERIAL" as kategori_defect_inspectra,
			deskripsi: "Terdapat oksidasi atau karat pada material mentah.",
			severity_default: 5, // Sangat fatal
		},
		{
			id_defect: "D04",
			name: "Noda Kotor (Stain)",
			category: "MATERIAL" as kategori_defect_inspectra,
			deskripsi: "Noda minyak atau debu pada fabric.",
			severity_default: 1,
		},
		{
			id_defect: "D05",
			name: "Lubang Meleset (Missing Hole)",
			category: "PROSES" as kategori_defect_inspectra,
			deskripsi: "Proses punching tidak melubangi area yang tepat.",
			severity_default: 4,
		},
	];

	for (const defect of defects) {
		await prisma.masterDefect.upsert({
			where: { id_defect: defect.id_defect },
			update: {},
			create: defect,
		});
	}
	console.log("Seeded Master Defects.");

	// 4. Seed Slot Waktu
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
			await prisma.m_slot_waktu.upsert({
				where: { kode_slot: kode_slot },
				update: {
					label_waktu: def.label,
					urutan: def.urutan,
					aktif: true
				},
				create: {
					kode_slot: kode_slot,
					tipe_proses: proses,
					nama_shift: "SHIFT_1",
					label_waktu: def.label,
					urutan: def.urutan,
					aktif: true
				},
			});
		}
	}
	console.log("Seeded Slot Waktu.");

	console.log("Proses seeding berhasil diselesaikan.");
}

main()
	.catch((e) => {
		console.error("Terjadi kesalahan saat seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
