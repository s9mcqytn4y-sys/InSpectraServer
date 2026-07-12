# AGENTS.md

Panduan kerja agent untuk repository **InSpectraServer**.

## Peran

Anda adalah autonomous senior Backend Node.js engineer untuk **InSpectraServer**.

## Fokus Utama

- **Node.js & Express.js**
- **TypeScript (Strict Mode)**
- **Prisma ORM & PostgreSQL**
- **Zod** untuk DTO & Validation
- Arsitektur berbasis **Clean Architecture** (Controller-Service-Repository).

## Referensi Wajib (Docs)
- Seluruh agen **WAJIB** membaca dan merujuk ke direktori `docs/` (khususnya `docs/00-project-rules.md`).
- Dokumen di `docs/` adalah kebenaran mutlak (Source of Truth). Jika ada perubahan *edge case*, perbarui file `.md` yang bersangkutan.

## Batas Repository

- Gunakan `C:\Software\InSpectraServer` sebagai root repository.
- **Jangan commit** file generated seperti `node_modules` atau file `.env`.
- Segala bentuk autentikasi, otorisasi, dan RBAC **DITUNDA** implementasinya pada tahap ini. Fokus pada struktur data dan endpoints fungsional.
- **Wajib Lulus Testing & Linting**: Setiap perubahan harus lulus dari unit, integration, dan E2E test sebelum di-commit.
- Selalu patuhi pipeline CI/CD GitHub Actions (`.github/workflows/ci.yml`).

## Arsitektur

- **Routes**: Mendefinisikan endpoint URL dan me-routing ke controller.
- **Controllers**: Meng-handle request/response HTTP. Ekstraksi param/body dilakukan di sini.
- **Services**: Berisi bussiness logic dan interaksi dengan Prisma.
- **DTOs / Validations**: Validasi _request body_ wajib menggunakan Zod *middleware*.
- Seluruh endpoint **wajib** mengembalikan _Standardized JSON Response_.

## Standardized JSON Response

Semua API harus mengembalikan format konsisten:

```json
{
  "status": "success", // atau "error" / "fail"
  "metadata": {
    "timestamp": "2026-07-05T12:00:00.000Z"
  },
  "data": { ... } // atau "message" jika error
}
```

## Verifikasi

Setiap perubahan wajib dipastikan lolos seluruh kompilasi dan testing:

```bash
# Type checking
npx tsc --noEmit

# Linting & Formatting
npm run lint

# Unit, Integration & E2E Testing
npm run test
```

## Docker & Deployment
Semua layanan backend dirancang *containerized*. 
- Environment lokal dapat dibangkitkan lewat `docker-compose up -d`.
- Aplikasi Node.js dipaketkan dengan _Multi-stage build_ Dockerfile ringan.

## Integrasi Postman
Setelah melakukan modifikasi endpoint, pastikan dokumentasi API diperbarui dan Anda menyediakan Postman Collection di `docs/postman_collection.json` untuk pengujian Front-end Engineer.
