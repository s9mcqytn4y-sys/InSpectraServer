# GEMINI.md - INSPECTRA SERVER MANDATE

Dokumen instruksi ketat untuk AI Agent yang melakukan modifikasi kode pada repositori InSpectraServer.

## 1. Arsitektur RESTful API & Validasi

Setiap API wajib mengimplementasikan pola yang sangat ketat untuk input data:

### Zod DTO (Data Transfer Objects):
* Wajib mendefinisikan Zod Schema untuk `body`, `query`, dan `params` di folder `src/dtos/`.
* Controller wajib divalidasi oleh Zod middleware. Jangan mem-parsing raw request body di Controller.

### Error Handling:
* Gunakan _Global Error Handling Middleware_ untuk menangkap _exception_.
* Jika Prisma melempar kode error unik (misal duplikasi unik, `P2002`), middleware harus menangkapnya dan mengubahnya menjadi pesan user-friendly dengan `status: error`.

## 2. Struktur Database (Prisma)
* Jangan mengedit database skema PostgreSQL secara manual menggunakan SQL DDL. Semua pembaruan struktur tabel HARUS dilakukan dari `prisma/schema.prisma`.
* Gunakan _snake_case_ untuk nama tabel database `@@map("m_part")` namun gunakan _camelCase_ pada Prisma Model properties di ranah Node.js, sesuai best practices Prisma.

## 3. Prioritas Migrasi & Modul
* Modul Master Data, Laporan Produksi, Cutting, Checksheet dan Karyawan adalah target utama migrasi ini.
* Semua operasi mutasi (Create, Update, Delete) wajib mematuhi standar relitas data.

## 4. Keamanan Dasar
* Pastikan `express-rate-limit` aktif di *global router*.
* Jangan membocorkan internal _stack trace_ di lingkungan *production*. 

## 5. Protokol Verifikasi Mandat
Sebelum perubahan kode selesai:
```bash
npx tsc --noEmit
npx eslint src/ --ext .ts
```
Jika gagal kompilasi atau ada error linter, perbaiki sebelum melanjutkan.
