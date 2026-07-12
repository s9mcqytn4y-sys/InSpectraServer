# DESIGN.md - Panduan UI/UX InSpectra (Frontend Web App)

Dokumen ini adalah acuan mutlak bagi **Stitch by Google** (atau AI Agent Frontend) untuk men-generate antarmuka pengguna (UI/UX) aplikasi InSpectra versi Web, khususnya dalam ekosistem **React & Next.js** (App Router).

> **Note:** Dokumen Arsitektur Backend kini berada di `docs/BACKEND_ARCHITECTURE.md`. Dokumen ini difokuskan sepenuhnya pada desain *Frontend Web*.

## 1. Filosofi Desain (Modern, Clean & Fresh)
Kita meninggalkan estetika industri yang kaku dan gelap. InSpectra Web App mengusung desain **Modern SaaS Dashboard** yang *clean*, presisi, dan segar.
- **Data-Driven Clarity:** Fokus pada konten. Hirarki visual diatur oleh tipografi dan ruang putih (white space), bukan kotak atau warna latar belakang yang berlebihan.
- **NO Glassmorphism:** DILARANG KERAS menggunakan efek blur, `backdrop-filter`, atau elemen kaca transparan. Desain harus *flat*, solid, dengan tepi yang tegas namun halus.
- **Responsiveness & Densitas Data:** Karena ini aplikasi operasional, tabel data harus cukup padat (*compact*) tanpa terlihat berantakan, serta responsif dari layar tablet industri hingga monitor desktop 4K.

## 2. Sistem Warna (Solid & High-Contrast)
Desain wajib responsif terhadap *Light Mode* (Utama) dan *Dark Mode*. Sistem warna didasarkan pada warna solid yang bersih.

### A. Background & Surface (Light Mode Primary)
- **Background Utama:** Putih murni (`#FFFFFF`) atau abu-abu sangat muda (`#F8FAFC` - *Slate 50*).
- **Surface (Card/Container):** Putih murni dengan border 1px solid `border-slate-200`. JANGAN gunakan bayangan (*shadow*) besar. Jika butuh kedalaman, gunakan shadow sangat tipis (`shadow-sm`).
- **Teks Utama:** Abu-abu sangat gelap (`#0F172A` - *Slate 900*) untuk *Heading*, dan (`#475569` - *Slate 600*) untuk teks sekunder/deskripsi.

### B. Aksen & Interaksi
- **Primary / CTA (Call to Action):** Gunakan warna **Vibrant Cobalt Blue** (`#2563EB`) atau **Emerald Green** (`#10B981`) yang segar untuk tombol utama (Simpan, Kirim).
- **Abnormal (Andon / Defect):** Gunakan warna **Crimson Red** solid (`#DC2626`) dipadu dengan badge *soft-red* (`#FEE2E2`) agar peringatan terlihat tegas dan tidak menimbulkan kebingungan.
- **Hover States:** Warna aksen hanya boleh digelapkan (*darken* 10%) saat status `:hover` atau `:active`.

## 3. Tipografi & Komponen (React / Next.js)
- **Font Utama:** Inter, Geist, atau Roboto. Prioritaskan penggunaan font *sans-serif* yang memiliki *readability* tinggi pada ukuran kecil.
- **Framework Komponen:** Sangat disarankan untuk menggunakan perpaduan **Tailwind CSS v4** dan komponen *unstyled* seperti **Radix UI** atau ekosistem **Shadcn UI**.
- **Bahasa UI End-User:** Wajib Bahasa Indonesia standar industri:
  - Checksheet -> **Lembar Periksa**
  - Master Data -> **Data Induk**
  - Reject -> **Defect** (Temuan NG)
  - Submit -> **Simpan / Kirim**

## 4. Anatomi Komponen Spesifik
### A. Card & Data Container
- Bersudut sedikit membulat (radius `md` atau `lg`, `0.5rem` - `0.75rem`).
- Tanpa background berwarna di dalam kontainer data. Hanya putih bersih dengan garis pembatas (border) `border-slate-200`.

### B. Input & Form (Validasi Inline)
- Field input menggunakan border 1px `slate-300`, membulat tipis `rounded-md`. Saat *focus*, gunakan ring biru muda (`ring-2 ring-blue-500/20`).
- **Validasi:** Pesan *error* form (Zod validation) harus tampil secara *inline* tepat di bawah kolom input dengan teks berwarna merah solid dan ikon `AlertCircle`. Jangan memunculkan semburat merah ke seluruh layar.

### C. Indikator Status & Badge
- Gunakan badge solid yang modern (teks tebal berwarna gelap di atas background pastel muda).
  - Contoh *Status OK*: Teks Hijau Tua di atas background Hijau Pucat.
  - Contoh *Status NG/Defect*: Teks Merah Tua di atas background Merah Pucat.

## 5. Manajemen State & Skeleton
- **Loading:** Tampilkan efek **Skeleton Shimmer** *flat* yang elegan saat memuat data Server Components atau SWR/React Query. Dilarang menggunakan animasi spinner yang memblokir layar kecuali untuk operasi *mutasi* (*submit* data).
- **Empty State:** Gunakan ilustrasi minimalis bergaya garis (*line-art*) 2D tanpa bayangan, dipadukan teks "Belum ada data".
- **Error Boundary:** Sediakan komponen *Error Fallback* (App Router) yang rapih, dengan tombol "Muat Ulang Halaman".

*Generate seluruh kode Frontend Next.js dengan berpegang erat pada estetika Modern SaaS, presisi komponen React, dan performa yang sangat cepat (tanpa efek grafis berat seperti Glassmorphism).*
