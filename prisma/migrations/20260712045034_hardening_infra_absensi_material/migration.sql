-- CreateEnum
CREATE TYPE "kategori_defect_inspectra" AS ENUM ('MATERIAL', 'PROSES');

-- CreateEnum
CREATE TYPE "keterangan_hadir_inspectra" AS ENUM ('HADIR', 'SAKIT', 'TELAT', 'CUTI', 'IZIN_PULANG', 'IZIN_TELAT');

-- CreateEnum
CREATE TYPE "lembur_non_main_job_inspectra" AS ENUM ('TIDAK_ADA', 'BANTU_LINE_LAIN', '5S', 'REWORK_REPAIR', 'SETTING_MESIN');

-- CreateEnum
CREATE TYPE "satuan_inspectra" AS ENUM ('PCS', 'ROLL', 'MTR', 'KG', 'GRAM', 'CONES', 'CAN', 'SET', 'LEMBAR', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "tipe_pekerja_inspectra" AS ENUM ('KARYAWAN', 'PKL');

-- CreateEnum
CREATE TYPE "tipe_proses_inspectra" AS ENUM ('PRESS', 'SEWING', 'CUTTING', 'MATERIAL', 'PASS_THROUGH', 'CONSUMABLE', 'PRESS_SPRAY', 'PRESS_CUTTING', 'PRESS_PRESS', 'QUALITY_CONTROL');

-- CreateTable
CREATE TABLE "m_part" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "uniq_no" TEXT NOT NULL,
    "part_no" TEXT,
    "nama_part" TEXT NOT NULL,
    "model" TEXT,
    "customer" TEXT,
    "komoditas" "tipe_proses_inspectra" NOT NULL,
    "total_item_per_kanban" INTEGER,
    "sample_item_per_kanban" INTEGER,
    "sample_cycle_note" TEXT,
    "lokasi_gambar" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "catatan" TEXT,
    "kode_internal" TEXT,
    "sumber_data" TEXT NOT NULL DEFAULT 'MANUAL',
    "status_kelengkapan" TEXT NOT NULL DEFAULT 'BELUM_DICEK',
    "butuh_review" BOOLEAN NOT NULL DEFAULT false,
    "catatan_review" TEXT,
    "dibuat_oleh" TEXT,
    "diperbarui_oleh" TEXT,

    CONSTRAINT "m_part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_material" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "kode_material" TEXT,
    "nama_material" TEXT NOT NULL,
    "nama_normalisasi" TEXT,
    "supplier_id" UUID,
    "supplier_manual" TEXT,
    "jenis_material" TEXT,
    "spec_ringkas" TEXT,
    "satuan" "satuan_inspectra" NOT NULL DEFAULT 'UNKNOWN',
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "spec" TEXT,
    "kategori_material" TEXT,
    "default_satuan" TEXT,
    "sumber_data" TEXT NOT NULL DEFAULT 'MANUAL',
    "status_kelengkapan" TEXT NOT NULL DEFAULT 'BELUM_DICEK',
    "butuh_review" BOOLEAN NOT NULL DEFAULT false,
    "catatan_review" TEXT,
    "dibuat_oleh" TEXT,
    "diperbarui_oleh" TEXT,
    "supplier" TEXT,
    "lebar_roll_cm" DECIMAL,
    "panjang_roll_cm" DECIMAL,
    "tebal_mm" DECIMAL,
    "berat_gsm" DECIMAL,
    "gramasi_gsm" DECIMAL,
    "warna" TEXT,
    "catatan_spesifikasi" TEXT,

    CONSTRAINT "m_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_supplier" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "kode_supplier" TEXT,
    "nama_supplier" TEXT NOT NULL,
    "kategori" TEXT,
    "alamat" TEXT,
    "kontak" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "catatan" TEXT,
    "nama_normalisasi" TEXT,
    "kategori_supplier" TEXT,
    "sumber_data" TEXT NOT NULL DEFAULT 'MANUAL',
    "dibuat_oleh" TEXT,
    "diperbarui_oleh" TEXT,

    CONSTRAINT "m_supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_defect" (
    "id_defect" TEXT NOT NULL,
    "nama_defect" TEXT NOT NULL,
    "kategori" "kategori_defect_inspectra" NOT NULL,
    "proses_default" "tipe_proses_inspectra",
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deskripsi" TEXT,
    "severity_default" INTEGER,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kode_display" TEXT,
    "satuan_input" TEXT NOT NULL DEFAULT 'PCS',
    "metode_pengukuran" TEXT NOT NULL DEFAULT 'COUNT',
    "proses_scope" TEXT NOT NULL DEFAULT 'ALL',
    "warna_badge" TEXT,
    "icon_key" TEXT,

    CONSTRAINT "m_defect_pkey" PRIMARY KEY ("id_defect")
);

-- CreateTable
CREATE TABLE "m_karyawan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama_lengkap" TEXT NOT NULL,
    "tipe_pekerja" "tipe_pekerja_inspectra" NOT NULL,
    "no_reg" TEXT,
    "line_process" "tipe_proses_inspectra" NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "m_karyawan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "e_sesi_checksheet" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "kode_sesi" TEXT,
    "tipe_proses" "tipe_proses_inspectra" NOT NULL,
    "tanggal_pemeriksaan" DATE NOT NULL DEFAULT CURRENT_DATE,
    "nama_shift" TEXT NOT NULL DEFAULT 'SHIFT_1',
    "nama_operator" TEXT,
    "nama_line" TEXT,
    "device_id" TEXT,
    "app_version" TEXT,
    "total_diperiksa" INTEGER NOT NULL DEFAULT 0,
    "total_ok" INTEGER NOT NULL DEFAULT 0,
    "total_ng" INTEGER NOT NULL DEFAULT 0,
    "rasio_ng_global" DECIMAL(8,3) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'TERKIRIM',
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "catatan" TEXT,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "takt_time_seconds" INTEGER DEFAULT 0,

    CONSTRAINT "e_sesi_checksheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "e_cutting_batch" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_sesi" UUID NOT NULL,
    "material_id" UUID NOT NULL,
    "material_spec_id" UUID,
    "tanggal" DATE NOT NULL DEFAULT CURRENT_DATE,
    "no_lot_roll" TEXT,
    "no_roll" TEXT,
    "size_cutting_cm" DECIMAL(12,3),
    "roll_width_cm_snapshot" DECIMAL(12,3),
    "roll_length_cm_snapshot" DECIMAL(12,3),
    "qty_layer_ok" INTEGER NOT NULL DEFAULT 0,
    "qty_layer_ng" INTEGER NOT NULL DEFAULT 0,
    "waste_panjang_cm" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "pic" TEXT,
    "catatan" TEXT,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ukuran_cutting_cm" DECIMAL(12,3),
    "tebal_mm_snapshot" DECIMAL(12,3),
    "berat_gsm_snapshot" DECIMAL(12,3),
    "gramasi_gsm_snapshot" DECIMAL(12,3),
    "nama_material_snapshot" VARCHAR,
    "nama_operator" VARCHAR,
    "spec_material_snapshot" TEXT,
    "uniq_no_part" TEXT,
    "nama_part_snapshot" TEXT,
    "part_size_reference_id" UUID,
    "ukuran_manual" BOOLEAN NOT NULL DEFAULT true,
    "size_reference_id" UUID,
    "nomor_lot_roll" TEXT,
    "panjang_ok_cm" DECIMAL(14,3),
    "panjang_ng_cm" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "panjang_waste_cm" DECIMAL(14,3),
    "panjang_roll_awal_cm" DECIMAL(14,3),
    "jumlah_potong_ok" INTEGER,
    "sumber_input" TEXT NOT NULL DEFAULT 'ANDROID',
    "takt_time_seconds" INTEGER DEFAULT 0,

    CONSTRAINT "e_cutting_batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_master_data" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tabel" TEXT NOT NULL,
    "aksi" TEXT NOT NULL,
    "entity_key" TEXT,
    "before_data" JSONB,
    "after_data" JSONB,
    "alasan" TEXT,
    "actor" TEXT,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_master_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "e_cutting_defect_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_cutting_batch" UUID NOT NULL,
    "id_defect" TEXT NOT NULL,
    "nama_defect_snapshot" TEXT,
    "jumlah_layer" INTEGER NOT NULL DEFAULT 0,
    "panjang_defect_cm" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "slot_waktu_id" UUID,
    "catatan" TEXT,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jumlah_layer_terdampak" INTEGER,
    "persentase_dari_ng" DECIMAL(8,3),
    "sumber_input" TEXT NOT NULL DEFAULT 'ANDROID',

    CONSTRAINT "e_cutting_defect_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "e_defect_checksheet" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_item" UUID NOT NULL,
    "id_defect" TEXT NOT NULL,
    "nama_defect_snapshot" TEXT NOT NULL,
    "kategori" "kategori_defect_inspectra" NOT NULL,
    "jumlah" INTEGER NOT NULL DEFAULT 0,
    "foto_url" TEXT,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "e_defect_checksheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "e_defect_slot_checksheet" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_defect_checksheet" UUID NOT NULL,
    "slot_waktu_id" UUID,
    "jumlah" INTEGER NOT NULL DEFAULT 0,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "e_defect_slot_checksheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "e_detail_cutting" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_item" UUID NOT NULL,
    "no_lot_roll" TEXT,
    "no_roll" TEXT,
    "size_cutting_cm" TEXT,
    "qty_ok" INTEGER,
    "qty_ng" INTEGER,
    "waste" DECIMAL(12,3),
    "pic" TEXT,
    "catatan" TEXT,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "e_detail_cutting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "e_item_checksheet" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_sesi" UUID NOT NULL,
    "uniq_no" TEXT NOT NULL,
    "jumlah_diperiksa" INTEGER NOT NULL DEFAULT 0,
    "jumlah_ok" INTEGER NOT NULL DEFAULT 0,
    "jumlah_ng" INTEGER NOT NULL DEFAULT 0,
    "rasio_ng" DECIMAL(8,3) NOT NULL DEFAULT 0,
    "catatan" TEXT,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "e_item_checksheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "e_laporan_produksi" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tanggal" DATE NOT NULL,
    "tipe_proses" TEXT NOT NULL,
    "mp_direct" INTEGER NOT NULL DEFAULT 0,
    "mp_indirect" INTEGER NOT NULL DEFAULT 0,
    "jkn_hour" INTEGER NOT NULL DEFAULT 0,
    "jkn_menit" INTEGER NOT NULL DEFAULT 0,
    "ot_prod" DECIMAL NOT NULL DEFAULT 0,
    "ot_non" DECIMAL NOT NULL DEFAULT 0,
    "bantuan_keluar" INTEGER NOT NULL DEFAULT 0,
    "bantuan_masuk" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "takt_time_seconds" INTEGER DEFAULT 0,

    CONSTRAINT "laporan_produksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "e_laporan_produksi_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_laporan" UUID NOT NULL,
    "id_part" UUID NOT NULL,
    "planning" INTEGER NOT NULL DEFAULT 0,
    "actual" INTEGER NOT NULL DEFAULT 0,
    "ng" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "laporan_produksi_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_crud_guard_rule" (
    "kode" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "perlu_konfirmasi" BOOLEAN NOT NULL DEFAULT true,
    "perlu_alasan" BOOLEAN NOT NULL DEFAULT false,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "m_crud_guard_rule_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "m_cutting_size_reference" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_id" UUID NOT NULL,
    "size_cutting_cm" DECIMAL(12,3),
    "ukuran_cutting_cm" DECIMAL(12,3),
    "urutan" INTEGER NOT NULL DEFAULT 1,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "material_spec_id" UUID,
    "lebar_roll_cm" DECIMAL(12,3),
    "panjang_roll_cm" DECIMAL(14,3),
    "berat_gsm" DECIMAL(12,3),
    "tebal_mm" DECIMAL(12,3),
    "label_ukuran" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "pemakaian_count" INTEGER NOT NULL DEFAULT 0,
    "sumber_data" TEXT NOT NULL DEFAULT 'MANUAL',
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "m_cutting_size_reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_data_revision" (
    "kode" TEXT NOT NULL,
    "versi" BIGINT NOT NULL DEFAULT 1,
    "deskripsi" TEXT,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "m_data_revision_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "m_default_image" (
    "kode" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon_key" TEXT,
    "bucket_id" TEXT,
    "storage_path" TEXT,
    "public_url" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "m_default_image_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "m_material_defect" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_id" UUID NOT NULL,
    "id_defect" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 1,
    "wajib_check" BOOLEAN NOT NULL DEFAULT true,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proses_scope" TEXT NOT NULL DEFAULT 'ALL',
    "satuan_input" TEXT,
    "metode_pengukuran" TEXT,
    "severity" INTEGER,
    "sumber_data" TEXT NOT NULL DEFAULT 'MANUAL',
    "catatan" TEXT,

    CONSTRAINT "m_material_defect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_material_komposisi" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "parent_material_id" UUID NOT NULL,
    "child_material_id" UUID NOT NULL,
    "child_material_spec_id" UUID,
    "peran_material" TEXT NOT NULL DEFAULT 'KOMPONEN',
    "urutan" INTEGER NOT NULL DEFAULT 1,
    "qty" DECIMAL(14,4),
    "satuan" TEXT,
    "persentase" DECIMAL(7,3),
    "wajib" BOOLEAN NOT NULL DEFAULT true,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "sumber_data" TEXT NOT NULL DEFAULT 'MANUAL',
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "m_material_komposisi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_material_spec" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_id" UUID NOT NULL,
    "spec_asli" TEXT,
    "lebar_value" DECIMAL(12,3),
    "lebar_unit" TEXT DEFAULT 'm',
    "panjang_value" DECIMAL(12,3),
    "panjang_unit" TEXT DEFAULT 'm',
    "tebal_value" DECIMAL(12,3),
    "tebal_unit" TEXT DEFAULT 'mm',
    "berat_value" DECIMAL(12,3),
    "berat_unit" TEXT DEFAULT 'gsm',
    "qty_value" DECIMAL(12,3),
    "qty_unit" "satuan_inspectra" DEFAULT 'UNKNOWN',
    "warna" TEXT,
    "grade" TEXT,
    "keterangan" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "material_spec_code" TEXT,
    "lebar_cm" DECIMAL(12,3),
    "panjang_roll_cm" DECIMAL(14,3),
    "tebal_mm" DECIMAL(12,3),
    "berat_gsm" DECIMAL(12,3),
    "gramasi_gsm" DECIMAL(12,3),
    "qty_default" DECIMAL(12,3),
    "satuan_qty" TEXT,
    "sumber_data" TEXT NOT NULL DEFAULT 'MANUAL',
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "satuan" "satuan_inspectra" NOT NULL DEFAULT 'UNKNOWN',

    CONSTRAINT "m_material_spec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_material_supplier" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "supplier_part_no" TEXT,
    "supplier_material_name" TEXT,
    "harga_referensi" DECIMAL(16,2),
    "mata_uang" TEXT NOT NULL DEFAULT 'IDR',
    "lead_time_hari" INTEGER,
    "is_preferred" BOOLEAN NOT NULL DEFAULT false,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "sumber_data" TEXT NOT NULL DEFAULT 'MANUAL',
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "m_material_supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_media_asset" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bucket_id" TEXT NOT NULL DEFAULT 'part-images',
    "storage_path" TEXT NOT NULL,
    "public_url" TEXT,
    "mime_type" TEXT,
    "size_bytes" BIGINT,
    "width_px" INTEGER,
    "height_px" INTEGER,
    "checksum_sha256" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AKTIF',
    "sumber" TEXT NOT NULL DEFAULT 'USER_UPLOAD',
    "dibuat_oleh" TEXT,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "m_media_asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_part_child" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "parent_uniq_no" TEXT NOT NULL,
    "child_uniq_no" TEXT NOT NULL,
    "peran_child" TEXT NOT NULL DEFAULT 'KOMPONEN',
    "qty" DECIMAL(14,4) NOT NULL DEFAULT 1,
    "urutan" INTEGER NOT NULL DEFAULT 1,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "sumber_data" TEXT NOT NULL DEFAULT 'MANUAL',
    "catatan" TEXT,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "m_part_child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_part_cutting_size_reference" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "uniq_no" TEXT NOT NULL,
    "size_cutting_cm" DECIMAL(12,3) NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 1,
    "nama_material_sumber" TEXT,
    "part_no_sumber" TEXT,
    "project_sumber" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "m_part_cutting_size_reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_part_defect" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "uniq_no" TEXT NOT NULL,
    "id_defect" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 1,
    "wajib_check" BOOLEAN NOT NULL DEFAULT true,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sumber" TEXT NOT NULL DEFAULT 'MANUAL',
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proses_scope" TEXT NOT NULL DEFAULT 'ALL',
    "satuan_input" TEXT,
    "metode_pengukuran" TEXT,
    "sumber_data" TEXT NOT NULL DEFAULT 'MANUAL',
    "catatan" TEXT,

    CONSTRAINT "m_part_defect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_part_defect_override" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "uniq_no" TEXT NOT NULL,
    "id_defect" TEXT NOT NULL,
    "mode_override" TEXT NOT NULL,
    "alasan" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "m_part_defect_override_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_part_image" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "uniq_no" TEXT NOT NULL,
    "media_id" UUID,
    "is_primary" BOOLEAN NOT NULL DEFAULT true,
    "urutan" INTEGER NOT NULL DEFAULT 1,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "catatan" TEXT,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "m_part_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_part_material" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "uniq_no" TEXT NOT NULL,
    "material_id" UUID NOT NULL,
    "material_spec_id" UUID,
    "urutan" INTEGER NOT NULL DEFAULT 1,
    "label_material" TEXT NOT NULL,
    "qty_per_part" DECIMAL(12,4),
    "wajib_check" BOOLEAN NOT NULL DEFAULT true,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "material_supplier_id" UUID,
    "peran_material" TEXT NOT NULL DEFAULT 'UTAMA',
    "usage_area" TEXT,
    "qty_per_kanban" DECIMAL(14,4),
    "panjang_kebutuhan_cm" DECIMAL(14,3),
    "lebar_kebutuhan_cm" DECIMAL(14,3),
    "sumber_data" TEXT NOT NULL DEFAULT 'MANUAL',
    "catatan" TEXT,

    CONSTRAINT "m_part_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_slot_waktu" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "kode_slot" TEXT NOT NULL,
    "tipe_proses" "tipe_proses_inspectra" NOT NULL,
    "nama_shift" TEXT NOT NULL DEFAULT 'SHIFT_1',
    "label_waktu" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "jam_mulai" TIME(6),
    "jam_selesai" TIME(6),
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "m_slot_waktu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_rasio_kehadiran" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tanggal" DATE NOT NULL DEFAULT CURRENT_DATE,
    "line_process" "tipe_proses_inspectra" NOT NULL,
    "karyawan_id" UUID NOT NULL,
    "keterangan" "keterangan_hadir_inspectra" NOT NULL DEFAULT 'HADIR',
    "jam_lembur_aktual" DECIMAL(4,1) DEFAULT 0,
    "lembur_non_main_job" "lembur_non_main_job_inspectra" NOT NULL DEFAULT 'TIDAK_ADA',
    "pic_name" TEXT NOT NULL,
    "dibuat_pada" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "takt_time_seconds" INTEGER DEFAULT 0,

    CONSTRAINT "t_rasio_kehadiran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_part_uniq_no_key" ON "m_part"("uniq_no");

-- CreateIndex
CREATE INDEX "idx_m_part_komoditas_aktif" ON "m_part"("komoditas", "uniq_no") WHERE (aktif = true);

-- CreateIndex
CREATE UNIQUE INDEX "m_material_kode_material_key" ON "m_material"("kode_material");

-- CreateIndex
CREATE UNIQUE INDEX "m_supplier_kode_supplier_key" ON "m_supplier"("kode_supplier");

-- CreateIndex
CREATE UNIQUE INDEX "m_supplier_nama_supplier_key" ON "m_supplier"("nama_supplier");

-- CreateIndex
CREATE UNIQUE INDEX "m_karyawan_no_reg_key" ON "m_karyawan"("no_reg");

-- CreateIndex
CREATE UNIQUE INDEX "e_sesi_checksheet_kode_sesi_key" ON "e_sesi_checksheet"("kode_sesi");

-- CreateIndex
CREATE INDEX "idx_e_sesi_tanggal_tipe" ON "e_sesi_checksheet"("tanggal_pemeriksaan" DESC, "tipe_proses");

-- CreateIndex
CREATE INDEX "idx_e_cutting_batch_part_reference" ON "e_cutting_batch"("uniq_no_part", "part_size_reference_id");

-- CreateIndex
CREATE INDEX "idx_e_cutting_batch_sesi" ON "e_cutting_batch"("id_sesi");

-- CreateIndex
CREATE INDEX "idx_e_cutting_defect_batch" ON "e_cutting_defect_detail"("id_cutting_batch");

-- CreateIndex
CREATE INDEX "idx_e_defect_item" ON "e_defect_checksheet"("id_item");

-- CreateIndex
CREATE UNIQUE INDEX "e_defect_checksheet_id_item_id_defect_key" ON "e_defect_checksheet"("id_item", "id_defect");

-- CreateIndex
CREATE INDEX "idx_e_item_sesi" ON "e_item_checksheet"("id_sesi");

-- CreateIndex
CREATE UNIQUE INDEX "laporan_produksi_tanggal_tipe_proses_key" ON "e_laporan_produksi"("tanggal", "tipe_proses");

-- CreateIndex
CREATE INDEX "idx_cutting_size_ref_material" ON "m_cutting_size_reference"("material_id", "urutan") WHERE (aktif = true);

-- CreateIndex
CREATE INDEX "idx_m_cutting_size_reference_material" ON "m_cutting_size_reference"("material_id", "size_cutting_cm") WHERE (aktif = true);

-- CreateIndex
CREATE UNIQUE INDEX "m_cutting_size_reference_material_id_size_cutting_cm_key" ON "m_cutting_size_reference"("material_id", "size_cutting_cm");

-- CreateIndex
CREATE UNIQUE INDEX "m_material_defect_material_id_id_defect_key" ON "m_material_defect"("material_id", "id_defect");

-- CreateIndex
CREATE INDEX "idx_material_komposisi_child" ON "m_material_komposisi"("child_material_id") WHERE (aktif = true);

-- CreateIndex
CREATE INDEX "idx_material_komposisi_parent" ON "m_material_komposisi"("parent_material_id") WHERE (aktif = true);

-- CreateIndex
CREATE UNIQUE INDEX "m_material_spec_material_id_spec_asli_key" ON "m_material_spec"("material_id", "spec_asli");

-- CreateIndex
CREATE INDEX "idx_material_supplier_material" ON "m_material_supplier"("material_id") WHERE (aktif = true);

-- CreateIndex
CREATE INDEX "idx_material_supplier_supplier" ON "m_material_supplier"("supplier_id") WHERE (aktif = true);

-- CreateIndex
CREATE UNIQUE INDEX "m_material_supplier_material_id_supplier_id_key" ON "m_material_supplier"("material_id", "supplier_id");

-- CreateIndex
CREATE UNIQUE INDEX "m_media_asset_bucket_id_storage_path_key" ON "m_media_asset"("bucket_id", "storage_path");

-- CreateIndex
CREATE INDEX "idx_part_child_child" ON "m_part_child"("child_uniq_no") WHERE (aktif = true);

-- CreateIndex
CREATE INDEX "idx_part_child_parent" ON "m_part_child"("parent_uniq_no") WHERE (aktif = true);

-- CreateIndex
CREATE UNIQUE INDEX "m_part_child_parent_uniq_no_child_uniq_no_peran_child_key" ON "m_part_child"("parent_uniq_no", "child_uniq_no", "peran_child");

-- CreateIndex
CREATE INDEX "idx_m_part_cutting_size_reference_part" ON "m_part_cutting_size_reference"("uniq_no", "urutan") WHERE (aktif = true);

-- CreateIndex
CREATE UNIQUE INDEX "m_part_cutting_size_reference_uniq_no_size_cutting_cm_key" ON "m_part_cutting_size_reference"("uniq_no", "size_cutting_cm");

-- CreateIndex
CREATE INDEX "idx_m_part_defect_uniq" ON "m_part_defect"("uniq_no") WHERE (aktif = true);

-- CreateIndex
CREATE UNIQUE INDEX "m_part_defect_uniq_no_id_defect_key" ON "m_part_defect"("uniq_no", "id_defect");

-- CreateIndex
CREATE UNIQUE INDEX "m_part_defect_override_uniq_no_id_defect_key" ON "m_part_defect_override"("uniq_no", "id_defect");

-- CreateIndex
CREATE UNIQUE INDEX "ux_part_image_primary" ON "m_part_image"("uniq_no") WHERE ((aktif = true) AND (is_primary = true));

-- CreateIndex
CREATE INDEX "idx_m_part_material_uniq" ON "m_part_material"("uniq_no") WHERE (aktif = true);

-- CreateIndex
CREATE UNIQUE INDEX "m_part_material_uniq_no_material_id_material_spec_id_key" ON "m_part_material"("uniq_no", "material_id", "material_spec_id");

-- CreateIndex
CREATE UNIQUE INDEX "m_slot_waktu_kode_slot_key" ON "m_slot_waktu"("kode_slot");

-- CreateIndex
CREATE INDEX "idx_absensi_tanggal_line" ON "t_rasio_kehadiran"("tanggal", "line_process");

-- CreateIndex
CREATE INDEX "idx_absensi_karyawan" ON "t_rasio_kehadiran"("karyawan_id");

-- CreateIndex
CREATE UNIQUE INDEX "t_rasio_kehadiran_tanggal_karyawan_id_key" ON "t_rasio_kehadiran"("tanggal", "karyawan_id");

-- AddForeignKey
ALTER TABLE "m_material" ADD CONSTRAINT "m_material_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "m_supplier"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_cutting_batch" ADD CONSTRAINT "e_cutting_batch_id_sesi_fkey" FOREIGN KEY ("id_sesi") REFERENCES "e_sesi_checksheet"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_cutting_batch" ADD CONSTRAINT "e_cutting_batch_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "m_material"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_cutting_batch" ADD CONSTRAINT "e_cutting_batch_material_spec_id_fkey" FOREIGN KEY ("material_spec_id") REFERENCES "m_material_spec"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_cutting_batch" ADD CONSTRAINT "e_cutting_batch_part_size_reference_id_fkey" FOREIGN KEY ("part_size_reference_id") REFERENCES "m_part_cutting_size_reference"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_cutting_batch" ADD CONSTRAINT "e_cutting_batch_size_reference_id_fkey" FOREIGN KEY ("size_reference_id") REFERENCES "m_cutting_size_reference"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_cutting_batch" ADD CONSTRAINT "e_cutting_batch_uniq_no_part_fkey" FOREIGN KEY ("uniq_no_part") REFERENCES "m_part"("uniq_no") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_cutting_defect_detail" ADD CONSTRAINT "e_cutting_defect_detail_id_cutting_batch_fkey" FOREIGN KEY ("id_cutting_batch") REFERENCES "e_cutting_batch"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_cutting_defect_detail" ADD CONSTRAINT "e_cutting_defect_detail_id_defect_fkey" FOREIGN KEY ("id_defect") REFERENCES "m_defect"("id_defect") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_cutting_defect_detail" ADD CONSTRAINT "e_cutting_defect_detail_slot_waktu_id_fkey" FOREIGN KEY ("slot_waktu_id") REFERENCES "m_slot_waktu"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_defect_checksheet" ADD CONSTRAINT "e_defect_checksheet_id_defect_fkey" FOREIGN KEY ("id_defect") REFERENCES "m_defect"("id_defect") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_defect_checksheet" ADD CONSTRAINT "e_defect_checksheet_id_item_fkey" FOREIGN KEY ("id_item") REFERENCES "e_item_checksheet"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_defect_slot_checksheet" ADD CONSTRAINT "e_defect_slot_checksheet_id_defect_checksheet_fkey" FOREIGN KEY ("id_defect_checksheet") REFERENCES "e_defect_checksheet"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_defect_slot_checksheet" ADD CONSTRAINT "e_defect_slot_checksheet_slot_waktu_id_fkey" FOREIGN KEY ("slot_waktu_id") REFERENCES "m_slot_waktu"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_detail_cutting" ADD CONSTRAINT "e_detail_cutting_id_item_fkey" FOREIGN KEY ("id_item") REFERENCES "e_item_checksheet"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_item_checksheet" ADD CONSTRAINT "e_item_checksheet_id_sesi_fkey" FOREIGN KEY ("id_sesi") REFERENCES "e_sesi_checksheet"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_item_checksheet" ADD CONSTRAINT "e_item_checksheet_uniq_no_fkey" FOREIGN KEY ("uniq_no") REFERENCES "m_part"("uniq_no") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_laporan_produksi_detail" ADD CONSTRAINT "laporan_produksi_detail_id_laporan_fkey" FOREIGN KEY ("id_laporan") REFERENCES "e_laporan_produksi"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "e_laporan_produksi_detail" ADD CONSTRAINT "laporan_produksi_detail_id_part_fkey" FOREIGN KEY ("id_part") REFERENCES "m_part"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_cutting_size_reference" ADD CONSTRAINT "m_cutting_size_reference_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "m_material"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_cutting_size_reference" ADD CONSTRAINT "m_cutting_size_reference_material_spec_id_fkey" FOREIGN KEY ("material_spec_id") REFERENCES "m_material_spec"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_material_defect" ADD CONSTRAINT "m_material_defect_id_defect_fkey" FOREIGN KEY ("id_defect") REFERENCES "m_defect"("id_defect") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_material_defect" ADD CONSTRAINT "m_material_defect_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "m_material"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_material_komposisi" ADD CONSTRAINT "m_material_komposisi_child_material_id_fkey" FOREIGN KEY ("child_material_id") REFERENCES "m_material"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_material_komposisi" ADD CONSTRAINT "m_material_komposisi_child_material_spec_id_fkey" FOREIGN KEY ("child_material_spec_id") REFERENCES "m_material_spec"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_material_komposisi" ADD CONSTRAINT "m_material_komposisi_parent_material_id_fkey" FOREIGN KEY ("parent_material_id") REFERENCES "m_material"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_material_spec" ADD CONSTRAINT "m_material_spec_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "m_material"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_material_supplier" ADD CONSTRAINT "m_material_supplier_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "m_material"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_material_supplier" ADD CONSTRAINT "m_material_supplier_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "m_supplier"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_part_child" ADD CONSTRAINT "m_part_child_child_uniq_no_fkey" FOREIGN KEY ("child_uniq_no") REFERENCES "m_part"("uniq_no") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_part_child" ADD CONSTRAINT "m_part_child_parent_uniq_no_fkey" FOREIGN KEY ("parent_uniq_no") REFERENCES "m_part"("uniq_no") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_part_cutting_size_reference" ADD CONSTRAINT "m_part_cutting_size_reference_uniq_no_fkey" FOREIGN KEY ("uniq_no") REFERENCES "m_part"("uniq_no") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_part_defect" ADD CONSTRAINT "m_part_defect_id_defect_fkey" FOREIGN KEY ("id_defect") REFERENCES "m_defect"("id_defect") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_part_defect" ADD CONSTRAINT "m_part_defect_uniq_no_fkey" FOREIGN KEY ("uniq_no") REFERENCES "m_part"("uniq_no") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_part_defect_override" ADD CONSTRAINT "m_part_defect_override_id_defect_fkey" FOREIGN KEY ("id_defect") REFERENCES "m_defect"("id_defect") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_part_defect_override" ADD CONSTRAINT "m_part_defect_override_uniq_no_fkey" FOREIGN KEY ("uniq_no") REFERENCES "m_part"("uniq_no") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_part_image" ADD CONSTRAINT "m_part_image_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "m_media_asset"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_part_image" ADD CONSTRAINT "m_part_image_uniq_no_fkey" FOREIGN KEY ("uniq_no") REFERENCES "m_part"("uniq_no") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_part_material" ADD CONSTRAINT "m_part_material_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "m_material"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_part_material" ADD CONSTRAINT "m_part_material_material_spec_id_fkey" FOREIGN KEY ("material_spec_id") REFERENCES "m_material_spec"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_part_material" ADD CONSTRAINT "m_part_material_material_supplier_id_fkey" FOREIGN KEY ("material_supplier_id") REFERENCES "m_material_supplier"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "m_part_material" ADD CONSTRAINT "m_part_material_uniq_no_fkey" FOREIGN KEY ("uniq_no") REFERENCES "m_part"("uniq_no") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "t_rasio_kehadiran" ADD CONSTRAINT "t_rasio_kehadiran_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "m_karyawan"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
