# InSpectraServer (Backend)

InSpectra Quality Control Backend Server. Server ini dirancang khusus untuk menangani proses inspeksi kualitas (QC), manajemen data pemotongan (cutting), dan agregasi laporan produksi secara *real-time*.

## 🚀 Teknologi (Tech Stack)

- **Node.js** & **Express.js 5** (Standard Web Server dengan Graceful Shutdown)
- **TypeScript** (Static Typing & Strict Mode)
- **Prisma ORM 7** dengan **PostgreSQL 16** (Connection Pooling max: 20)
- **Idempotency Key** untuk mencegah duplikasi data transaksi (Batch Sync)
- **Zod** untuk Validasi DTO (Pesan Kesalahan dalam Bahasa Indonesia)
- **Swagger UI** untuk Dokumentasi API Interaktif
- **Biome** untuk Linter & Formatter
- **Vitest** untuk Unit, Integration & E2E Testing
- **Pino** untuk Structured Logging

## 🏗️ Arsitektur Ekosistem

```
C:\Software\
├── docker-compose.yml          # Orkestrasi terpadu (DB + Backend + Frontend)
├── InSpectraServer/             # ← Anda di sini (Backend Express.js)
│   ├── src/
│   ├── prisma/
│   ├── docs/
│   ├── scripts/
│   ├── uploads/                 # Foto defect & asset media
│   └── Dockerfile
└── inspectra-frontend/          # Frontend Next.js (App Router + Tailwind)
    ├── src/
    └── Dockerfile
```

## 🛠️ Prasyarat

- Node.js (direkomendasikan v20+)
- PostgreSQL 16+ Database
- `npm`

## ⚙️ Instalasi

1. Lakukan *clone* pada repositori ini.
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Konfigurasi *Environment Variables*:
   Salin `.env.example` ke `.env` dan isi detail koneksi PostgreSQL Anda.
   ```bash
   cp .env.example .env
   ```

## 🗄️ Database & Seeding

Sinkronisasi skema Prisma dengan database dan jalankan *seeder* untuk populasi master data awal:

```bash
# Melakukan push skema ke dalam database
npx prisma db push

# Menjalankan seeder (Parts, Defects, Material, Slot Waktu)
npx prisma db seed
```

## 🚀 Menjalankan Aplikasi

### Mode Pengembangan (Development)
```bash
npm run dev
```
Server akan berjalan secara otomatis di port yang ditentukan di dalam `.env` (default: `3000`). Perubahan pada kode akan langsung merestart server.

### Mode Produksi (Production)
```bash
npm run build
npm start
```

### Docker (Full Containerization)
Gunakan Docker Compose dari direktori ekosistem (`C:\Software\`):
```bash
cd C:\Software
docker-compose up -d --build
```

| Service | Port Host | Port Container | Keterangan |
|---------|-----------|---------------|------------|
| `inspectra-db` | 5432 | 5432 | PostgreSQL 16 |
| `inspectra-backend` | 8000 | 3000 | Express.js API |
| `inspectra-frontend` | 3001 | 3000 | Next.js App |

Untuk mematikan semua container:
```bash
docker-compose down
```

## 📖 Dokumentasi API

Setelah server berjalan, dokumentasi interaktif Swagger UI tersedia di:
```
http://localhost:8000/api-docs
```

### File Dokumentasi Tambahan
- **OpenAPI Spec**: `docs/openapi.json` — Spesifikasi OpenAPI 3.0 lengkap
- **Postman Collection**: `docs/postman_collection.json` — Koleksi siap-impor untuk Postman
- **REST Client**: `api.http` — File HTTP untuk VS Code REST Client

### Regenerasi OpenAPI Spec
```bash
npm run swagger:export
```

## 🔒 Standar Kualitas Kode

Kode dalam proyek ini dijaga ketat menggunakan Biome dan TypeScript.

Linting dan Formatting:
```bash
npm run format
npm run lint
```

Type Checking (Wajib lolos sebelum commit):
```bash
npx tsc --noEmit
```

### Pengujian (Unit, Integration & E2E)
Aplikasi ini menggunakan Vitest untuk piramida pengujian lengkap:
```bash
npm run test
```

## ⚙️ CI/CD & GitHub Actions
Setiap *push* ke cabang `main` atau pembuatan *Pull Request* akan secara otomatis diproses oleh **GitHub Actions**. Pipeline ini melakukan:
1. Pengecekan *linting* (Biome).
2. Pengecekan tipe data statis (TypeScript).
3. Setup database & seeding.
4. Pengujian Unit dan E2E (Vitest).

Konfigurasi pipeline dapat dilihat di `.github/workflows/ci.yml`.

## 📝 Lisensi

Internal Use Only.
