# 04 - Deployment & Roadmap

## Panduan Deployment (Deployment Guide)
`InSpectraServer` didesain untuk *cloud-native deployment* dengan menggunakan containerisasi (Docker).

1. **Persiapan Environtment**:
   - Salin `.env.example` ke `.env`
   - Pastikan URL `DATABASE_URL` menunjuk ke instansi PostgreSQL yang aktif.

2. **Database Migration & Seeding**:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npx prisma db seed
   ```

3. **Running Service Lokal**:
   - `npm run dev` (dengan *hot reload* untuk pengembangan)
   - `npm run build` && `npm start` (untuk kompilasi TypeScript dan eksekusi produksi)

4. **Running dengan Docker**:
   ```bash
   docker-compose up --build -d
   ```
   *Service Express akan terbuka di port `8001`, dan PostgreSQL database di port `5432`.*

## Roadmap Pengembangan (Project Roadmap)

**Fase 1: Fondasi dan Master Data (SELESAI)**
- [x] Konfigurasi Node.js, Express, TypeScript, Biome.
- [x] Desain skema Prisma untuk Master Data & Karyawan.
- [x] Seeding data (Parts, Materials, Defects, Slots) dalam Bahasa Indonesia.
- [x] Pembuatan DTO (Zod) dan standar Controller JSON response.

**Fase 2: Transaksional QC & Laporan (SEDANG BERJALAN)**
- [ ] Implementasi endpoint Cutting Batch dengan perhitungan kalkulasi waste.
- [ ] Implementasi form Checksheet inspeksi harian.
- [ ] Agregasi Laporan Produksi.

**Fase 3: Autentikasi dan Keamanan (AKAN DATANG)**
- [ ] Integrasi JWT Token & otorisasi Role-Based Access Control (RBAC).
- [ ] Middleware rate-limiting global.
- [ ] Validasi *security headers* (Helmet, CORS spesifik).

**Fase 4: Frontend Integration & E2E Tests**
- [ ] Menghubungkan Backend dengan Aplikasi Android (React Native / Kotlin).
- [ ] Penambahan coverage unit & integration test (misal menggunakan Jest atau Vitest).
