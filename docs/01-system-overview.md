# 01 - System Overview & Architecture

## Gambaran Sistem
`InSpectraServer` adalah layanan backend RESTful yang didedikasikan untuk mengelola Quality Control (QC) pada proses manufaktur industri (seperti operasional Cutting, Press, Sewing). Sistem ini menjadi tulang punggung pencatatan lot produksi, perhitungan material waste, dan validasi defect.

## Arsitektur Aplikasi (Clean Architecture)
Sistem ini menggunakan pemisahan tanggung jawab yang tegas:
1. **Routes (`src/routes`)**: Menerima request HTTP masuk dan memetakan URL ke Controller yang tepat.
2. **DTO / Validations (`src/dtos`)**: Definisi skema *Zod* untuk validasi payload. Request akan dicegat oleh middleware sebelum masuk ke controller jika tidak valid.
3. **Controllers (`src/controllers`)**: Menangani alur Request/Response. Tidak boleh ada logika bisnis kompleks di sini; tugasnya murni meng-extract parameter dan memformat output (Standard JSON Response).
4. **Services (`src/services`)**: Tempat logika bisnis utama berada. Service berkomunikasi langsung dengan Prisma ORM.

## Struktur Repositori
```
C:\Software\InSpectraServer\
├── .github/          # Konfigurasi CI/CD GitHub Actions
├── .vscode/          # Pengaturan standar Workspace (Biome, Prisma)
├── docs/             # Dokumentasi sistem ini
├── prisma/           # Schema database dan skrip seeder (seed.ts)
├── src/
│   ├── config/       # Konfigurasi aplikasi (Prisma client, multer upload)
│   ├── controllers/  # Layer presentasi API
│   ├── dtos/         # Zod schemas untuk validasi (Bahasa Indonesia error msgs)
│   ├── middlewares/  # Error handler & Zod validator interceptors
│   ├── routes/       # Definisi endpoint RESTful
│   ├── services/     # Logika bisnis inti
│   ├── utils/        # Fungsi bantuan (seperti formatter ApiResponse)
│   └── index.ts      # Entry point aplikasi Express
├── api.http          # REST Client testing
└── DESIGN.md         # Desain sistem dari perspektif Frontend UI/UX
```

## Ekosistem Pengembangan
- **Biome**: Digunakan sebagai linter dan formatter super cepat pengganti ESLint dan Prettier.
- **REST Client**: Integrasi pengujian API langsung di dalam VS Code (melalui file `api.http`).
