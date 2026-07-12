# InSpectraServer

InSpectra Quality Control Backend Server. Server ini dirancang khusus untuk menangani proses inspeksi kualitas (QC), manajemen data pemotongan (cutting), dan agregasi laporan produksi secara *real-time*.

## 🚀 Teknologi (Tech Stack)

- **Node.js** & **Express.js** (Standard Web Server dengan Graceful Shutdown)
- **TypeScript** (Static Typing & Strict Mode)
- **Prisma ORM** dengan **PostgreSQL** (Connection Pooling)
- **Idempotency Key** untuk mencegah duplikasi data transaksi (Batch Sync)
- **Zod** untuk Validasi DTO (Pesan Kesalahan dalam Bahasa Indonesia)
- **Swagger UI** untuk Dokumentasi API
- **Biome** untuk Linter & Formatter

## 🛠️ Prasyarat

- Node.js (direkomendasikan v20+)
- PostgreSQL Database
- `npm` atau `yarn`

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
Server akan berjalan secara otomatis di port yang ditentukan di dalam `.env` (default: `8001`). Perubahan pada kode akan langsung merestart server.

### Mode Produksi (Production)
```bash
npm run build
npm start
```

### Docker (Full Containerization)
Anda juga dapat menggunakan Docker untuk mempermudah eksekusi lingkungan:
```bash
docker-compose up -d --build
```
Aplikasi backend (Node.js) dan database (PostgreSQL) akan di-build dan dijalankan secara terisolasi sebagai microservice mandiri yang siap-produksi.
Untuk mematikan container:
```bash
docker-compose down
```

## 📖 Dokumentasi API

Setelah server berjalan, dokumentasi interaktif Swagger UI akan tersedia di:

```text
http://localhost:8001/api-docs
```
Selain Swagger, Anda juga dapat menggunakan file **Postman Collection** yang tersedia di direktori `docs/postman_collection.json` untuk pengujian *client-side* tanpa mengatur parameter manual.

Seluruh panduan arsitektur dan aturan sistem tersedia di direktori `docs/`.

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
3. Pengujian Unit dan E2E (Vitest).

Konfigurasi pipeline dapat dilihat di `.github/workflows/ci.yml`.

## 📝 Lisensi

Internal Use Only.
