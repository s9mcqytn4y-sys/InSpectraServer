import {
  type tipe_proses_inspectra,
  type kategori_defect_inspectra,
} from "@prisma/client";
import prisma from "../src/config/prisma";

async function main() {
  console.log("Start seeding ...");

  // 1. Seed Master Part
  const parts = [
    {
      uniqNo: "PR-001",
      part_no: "PART-1001",
      name: "Front Bumper Bracket",
      commodity: "PRESS" as tipe_proses_inspectra,
      model: "MODEL-X",
      customer: "CUSTOMER-A",
    },
    {
      uniqNo: "PR-002",
      part_no: "PART-1002",
      name: "Rear Subframe",
      commodity: "PRESS" as tipe_proses_inspectra,
      model: "MODEL-Y",
      customer: "CUSTOMER-B",
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

  // 2. Seed Master Defect
  const defects = [
    {
      id_defect: "D01",
      name: "Scratch",
      category: "PROSES" as kategori_defect_inspectra,
    },
    {
      id_defect: "D02",
      name: "Dent",
      category: "PROSES" as kategori_defect_inspectra,
    },
    {
      id_defect: "D03",
      name: "Rust",
      category: "MATERIAL" as kategori_defect_inspectra,
    },
    {
      id_defect: "D04",
      name: "Bent",
      category: "PROSES" as kategori_defect_inspectra,
    },
    {
      id_defect: "D05",
      name: "Missing Hole",
      category: "PROSES" as kategori_defect_inspectra,
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

  // 3. Seed Slot Waktu
  const slots = [
    {
      kode_slot: "PRESS_SHIFT_1_SLOT_1",
      tipe_proses: "PRESS" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "08.00 - 09.00",
      urutan: 1,
    },
    {
      kode_slot: "PRESS_SHIFT_1_SLOT_2",
      tipe_proses: "PRESS" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "09.00 - 10.00",
      urutan: 2,
    },
    {
      kode_slot: "PRESS_SHIFT_1_SLOT_3",
      tipe_proses: "PRESS" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "10.00 - 11.00",
      urutan: 3,
    },
    {
      kode_slot: "PRESS_SHIFT_1_SLOT_4",
      tipe_proses: "PRESS" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "11.00 - 12.00",
      urutan: 4,
    },
    {
      kode_slot: "PRESS_SHIFT_1_SLOT_5",
      tipe_proses: "PRESS" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "13.00 - 14.00",
      urutan: 5,
    },
    {
      kode_slot: "PRESS_SHIFT_1_SLOT_6",
      tipe_proses: "PRESS" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "14.00 - 15.00",
      urutan: 6,
    },
    {
      kode_slot: "PRESS_SHIFT_1_SLOT_7",
      tipe_proses: "PRESS" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "15.00 - 16.00",
      urutan: 7,
    },
    {
      kode_slot: "PRESS_SHIFT_1_SLOT_8",
      tipe_proses: "PRESS" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "16.00 - 17.00",
      urutan: 8,
    },
    {
      kode_slot: "SEWING_SHIFT_1_SLOT_1",
      tipe_proses: "SEWING" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "08.00 - 09.00",
      urutan: 1,
    },
    {
      kode_slot: "SEWING_SHIFT_1_SLOT_2",
      tipe_proses: "SEWING" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "09.00 - 10.00",
      urutan: 2,
    },
    {
      kode_slot: "SEWING_SHIFT_1_SLOT_3",
      tipe_proses: "SEWING" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "10.00 - 11.00",
      urutan: 3,
    },
    {
      kode_slot: "SEWING_SHIFT_1_SLOT_4",
      tipe_proses: "SEWING" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "11.00 - 12.00",
      urutan: 4,
    },
    {
      kode_slot: "SEWING_SHIFT_1_SLOT_5",
      tipe_proses: "SEWING" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "13.00 - 14.00",
      urutan: 5,
    },
    {
      kode_slot: "SEWING_SHIFT_1_SLOT_6",
      tipe_proses: "SEWING" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "14.00 - 15.00",
      urutan: 6,
    },
    {
      kode_slot: "SEWING_SHIFT_1_SLOT_7",
      tipe_proses: "SEWING" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "15.00 - 16.00",
      urutan: 7,
    },
    {
      kode_slot: "SEWING_SHIFT_1_SLOT_8",
      tipe_proses: "SEWING" as tipe_proses_inspectra,
      nama_shift: "SHIFT_1",
      label_waktu: "16.00 - 17.00",
      urutan: 8,
    },
  ];

  for (const slot of slots) {
    await prisma.m_slot_waktu.upsert({
      where: { kode_slot: slot.kode_slot },
      update: {},
      create: slot,
    });
  }
  console.log("Seeded Slot Waktu.");

  // We are bypassing ChecksheetSession mock seed for robustness since
  // it requires complex relational setup with checksheets. The Android
  // app's test queue has valid payloads for that. Master Data is enough.
  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
