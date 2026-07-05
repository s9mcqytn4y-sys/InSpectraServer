# 00 - Project Rules & Mandate

Dokumen ini adalah **sumber kebenaran mutlak (Source of Truth)** untuk aturan pengembangan backend `InSpectraServer`. Semua AI Agent dan pengembang wajib mematuhi aturan di bawah ini.

## 1. Fokus Utama (Core Principles)
- **Node.js & Express.js** sebagai core backend framework.
- **TypeScript (Strict Mode)** digunakan di seluruh basis kode.
- **Prisma ORM & PostgreSQL** untuk database operations.
- **Zod** untuk validasi skema input (DTO).
- Arsitektur wajib mengikuti pola **Clean Architecture** (Routes -> Controllers -> Services -> Database).

## 2. Struktur Data dan Respons (API Contract)
Setiap endpoint API **wajib** mengembalikan JSON dengan format yang terstandarisasi. Ini sangat krusial agar *Frontend* bisa melakukan parsing dengan mudah tanpa error.

### Standar JSON Response:
```json
{
  "status": "success", // atau "fail" jika bad request, atau "error" jika internal server error
  "metadata": {
    "timestamp": "2026-07-05T12:00:00.000Z",
    "count": 10 // Jika mengembalikan array list
  },
  "data": { ... } // Berisi data aktual. Kosongkan (null) jika status "error", dan gunakan properti "message"
}
```

### Zod DTO Validation:
- Middleware `validate(schema)` harus diletakkan di rute (routes) sebelum request masuk ke controller.
- Error dari Zod harus ditangkap oleh middleware dan diformat menjadi pesan berbahasa Indonesia yang jelas untuk user.

## 3. Database dan Prisma
- Dilarang keras melakukan manipulasi skema DDL PostgreSQL secara langsung. Segala perubahan struktur tabel wajib dilakukan melalui `prisma/schema.prisma`.
- Nama tabel di dalam PostgreSQL menggunakan format `snake_case` (misal: `@@map("m_part")`).
- Nama properti model di Prisma Node.js menggunakan format `camelCase` (standar Prisma).

## 4. Prioritas Pengembangan
1. **Master Data**: Part, Material, Defect, Karyawan.
2. **Quality Control**: Cutting, Checksheet (Proses QC lainnya).
3. **Laporan**: Aggregasi data produksi harian.

Fitur *Autentikasi (JWT/Role-Based Access Control)* saat ini berstatus **DITUNDA**. Abaikan pengecekan payload user ID sampai fondasi bisnis logik inti selesai.

## 5. Deployment & CI/CD
- Repositori menggunakan GitHub Actions (`.github/workflows/ci.yml`).
- Pipeline wajib melewati fase: `npx tsc --noEmit` dan `npx biome check ./src`.
- Docker digunakan untuk kontainerisasi aplikasi (`Dockerfile` dan `docker-compose.yml`).
