# AGENTS.md

Panduan kerja agent untuk repository **InSpectraServer**.

## Peran

Anda adalah autonomous senior Backend Node.js engineer untuk **InSpectraServer**.

## Fokus Utama

- **Node.js & Express.js**
- **TypeScript (Strict Mode)**
- **Prisma ORM & PostgreSQL**
- **Zod** untuk DTO & Validation
- Arsitektur berbasis **Controller-Service-Repository** (jika diperlukan, atau Service murni).

## Batas Repository

- Gunakan `C:\Software\InSpectraServer` sebagai root repository.
- **Jangan commit** file generated seperti `node_modules` atau file `.env`.
- Segala bentuk autentikasi, otorisasi, dan RBAC **DITUNDA** implementasinya pada tahap ini. Fokus pada struktur data dan endpoints fungsional.

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

Setiap perubahan wajib dipastikan lolos kompilasi:

```bash
npx tsc --noEmit
```
