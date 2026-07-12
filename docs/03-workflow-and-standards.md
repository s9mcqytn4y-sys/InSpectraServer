# 03 - Workflow & Coding Standards

## Siklus Pengembangan (Development Workflow)
Setiap pengembangan fitur baru atau perbaikan *bug* wajib melewati siklus yang ketat:
1. **Analisis Schema Prisma**: Pahami struktur tabel dan relasinya sebelum merancang endpoint.
2. **Definisi DTO (Zod)**: Buat atau update validasi Zod untuk mengamankan input dari Frontend. Pesan error wajib menggunakan bahasa Indonesia yang ramah pengguna (contoh: "Jumlah NG tidak boleh bernilai negatif").
3. **Implementasi Service**: Tulis operasi mutasi database (`create`, `upsert`, `update`) dengan Prisma Client. Gunakan tipe data yang sesuai dengan model yang dihasilkan Prisma.
4. **Implementasi Controller**: Panggil layer Service dan format balikan menggunakan metode utilitas `successResponse(data, metadata)`.
5. **Verifikasi Mandiri**:
   - Jalankan `npx tsc --noEmit`
   - Jalankan `npx biome check ./src`
   - Test melalui skrip `.http` di folder proyek.

## Standar Pengkodean (Coding Standards)
- **Penamaan Variabel & Fungsi**: Gunakan `camelCase` (contoh: `createBatch`, `sessionId`).
- **Penamaan Model Prisma**:
  - Tabel DB: `snake_case` dengan awalan modul (`m_part`, `e_sesi_checksheet`).
  - Prisma Client Model: `camelCase` atau `PascalCase` bawaan (contoh: `MasterPart`, `ChecksheetSession`).
- **Komentar Kode**: Digunakan hanya untuk memperjelas algoritma yang rumit. Dokumentasi endpoint disarankan ditulis menggunakan komentar anotasi Swagger `@swagger`.
- **DRY (Don't Repeat Yourself)**: Sentralisasi semua utilitas response, custom error handler, dan middleware Zod interceptor.

## Pengujian (Testing)
Pengujian E2E (End-to-End) sedang direncanakan. Saat ini pengujian mengandalkan:
1. Static Type Checking (TypeScript).
2. Linter Analysis (Biome).
3. Payload API Validation (Zod).
4. Manual Integration Testing via REST Client (`api.http`).

## Workflow Transaksional (API Flow)
Berikut adalah alur penggunaan API transaksional yang sudah diimplementasikan (Fase 2):

### 1. Checksheet QC
1. **Batch Submit**: POST `/api/v1/checksheet/submit-batch` adalah pendekatan baru dan direkomendasikan. Frontend mengumpulkan seluruh item, defect, dan alokasi waktu dalam satu payload. Server memprosesnya dalam **satu transaksi atomik**.
2. **Validasi Strict**: Proses `submit-batch` memvalidasi secara ketat bahwa defect (`id_defect`) yang di-submit **wajib** terdaftar pada `m_part_defect` untuk part (`uniq_no`) yang dilaporkan. Jika tidak terdaftar, transaksi dibatalkan.
3. **Legacy (Single Submit)**: Terdapat endpoint `/sessions`, `/item`, `/defect` yang masih bisa dipakai (opsional).

### 2. Cutting Batch
1. **Create Batch**: POST `/api/v1/cutting/batches` untuk mencatat aktivitas pemotongan material. API ini akan secara otomatis mengalkulasi `panjang_ok_cm` dan `panjang_ng_cm` dari input *layer* dan ukuran *cutting*.

### 3. Laporan Produksi
1. **Create Laporan**: POST `/api/v1/laporan` untuk membuat Laporan Harian (Header).
2. **Create Laporan Detail**: POST `/api/v1/laporan/detail` untuk merincikan `planning` dan `actual` per Item/Part pada laporan tersebut.
