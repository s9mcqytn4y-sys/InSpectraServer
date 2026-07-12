# InSpectra - Frontend Design System & Architecture Plan

## 1. Visi & Konsep Utama

Aplikasi web InSpectra dirancang ulang dari mobile-first menjadi **Enterprise Web Application** yang scalable menggunakan **React.js & Next.js 14+ (App Router)**. Konsep UI/UX menghindari "glassmorphism" dan lebih menekankan pada estetika **"Modern, Clean, Fresh & Profesional"**.

### Objektif Desain:
- **Kejelasan (Clarity):** Data operasional, laporan, dan pareto harus mudah dibaca.
- **Efisiensi (Efficiency):** Pengurangan jumlah klik untuk akses Laporan, Absensi, Pareto, dan Master Data.
- **Fokus (Focus):** Menggunakan desain "Flat/Clean" dengan penekanan pada Data-Ink ratio (menghapus elemen dekoratif yang tidak perlu).

## 2. Tech Stack Frontend

- **Framework:** Next.js 14 (App Router) + React 18+
- **Styling:** Tailwind CSS v3/v4 + Shadcn UI (Radix UI primitives)
- **State Management:** Zustand (Global State) + React Query (Server State / Data Fetching)
- **Data Table:** TanStack Table v8 (untuk reporting, checksheet, & master data)
- **Charts:** Recharts / Chart.js (Untuk Pareto dan Tren Laporan)
- **Forms:** React Hook Form + Zod (Validasi Kuat)
- **PDF Export:** Di-handle oleh Backend via REST API (PDFMake) -> Frontend menyediakan trigger download/view blob (`window.open` atau FileSaver).

## 3. UI/UX & Design Guidelines

### A. Palet Warna (Modern & Clean)
Tidak menggunakan transparansi blur (glassmorphism). Memakai skema warna solid dengan kontras tinggi (Web Content Accessibility Guidelines - WCAG 2.1 AA).

- **Primary Color:** `#0f172a` (Slate 900) - Digunakan untuk sidebar, header, dan teks utama.
- **Accent/Brand Color:** `#2563eb` (Blue 600) - CTA, tombol aktif, link, highlight tabel.
- **Success Color:** `#16a34a` (Green 600) - Status OK, Indikator hadir.
- **Danger/Warning Color:** `#dc2626` (Red 600) / `#ea580c` (Orange 600) - Status NG, Error, Absen.
- **Background (Surface):** `#f8fafc` (Slate 50) - Background aplikasi (soft gray).
- **Card/Container:** `#ffffff` (White) - Card dengan border `#e2e8f0` (Slate 200), shadow sangat tipis (`shadow-sm`).

### B. Typography
- **Font Family:** `Inter` atau `Geist` (Modern Sans-Serif).
- **Heading:** Bold & tebal, untuk judul halaman (`text-2xl font-semibold`).
- **Body:** `text-sm` (14px) untuk data table dan form agar muat banyak informasi di layar.

### C. Komponen Shadcn UI yang digunakan
- **Data Table:** Kolom dengan filter, pagination, dan sorting dinamis. Standarisasi tabel tabular layout (border-collapse, alternating rows) untuk densitas data maksimal.
- **Date Range Picker:** Integrasi `date-fns` untuk filter laporan bulanan/mingguan.
- **Combobox / Select:** Untuk memilih `Line Process` dan fitur pencarian Master Data.
- **Dialogs (Modals):** Untuk form input CRUD (Create/Update Master Data) secara cepat tanpa pindah halaman.
- **Toast / Sonner:** Untuk notifikasi sukses/error mutasi data.

## 4. User Journey & Standarisasi Fitur Laporan

### a. Dashboard, Analytics & Pareto
1. **User membuka aplikasi:** Landing page langsung menampilkan ringkasan hari ini.
2. **Chart Pareto:** Menampilkan grafik bar chart kelainan/NG terbanyak (dari `/dashboard/pareto` dan `/dashboard/top3-defects`).
3. **Filter Global:** Pengguna dapat mengganti rentang tanggal di kanan atas, seluruh chart akan ter-update otomatis.
4. **Export PDF Pareto:** Menambahkan tombol "Export PDF" untuk men-download tabular laporan pareto dan tren yang diproses oleh backend.

### b. E-Checksheet & Transaksi (Press, Sewing, Cutting)
1. **Masuk ke Menu E-Checksheet:** Memilih departemen.
2. **Pilih Sesi/Batch:** Melihat daftar batch hari ini.
3. **Form Input Clean (Standar Tabular):** Form dirender sebagai data grid (spreadsheet-like) yang bisa diakses cepat dengan keyboard navigation (Tab & Enter) untuk kecepatan entri data.
4. **Validasi:** Edge-case di-handle kuat di UI (Misal: QTY NG tidak bisa lebih besar dari QTY Diperiksa - QTY OK).

### c. Sistem Laporan (Produksi & Absensi)
1. **Navigasi ke Menu Laporan.**
2. **Filter Data:** Pilih Date Range, Tipe Proses, atau Cari Nama.
3. **Standarisasi View Data:** Tabel laporan wajib menggunakan densitas tinggi (padding minimum) agar mencakup metrik Planning, Actual, NG, MP Direct, dll.
4. **PDF Export Architecture:** Tombol "Download PDF" yang secara transparan mengirim request ke API dengan `exportPdf=true`. Frontend menangani byte stream response sebagai download file atau Blob view, memastikan layout A4 Landscape yang di-generate backend tersaji tanpa distorsi browser-printing.

### d. Master Data (Data Induk)
1. **Navigasi ke Master Data (Material / Karyawan / Part).**
2. **List View:** Table dengan search bar yang memanfaatkan **GIN Index (Full-Text Search)** di backend untuk pencarian super cepat (`nama_lengkap`, `nama_part`).
3. **Detail Spec:** Khusus untuk material cutting, dimensi (panjang, lebar, tebal, berat, gramasi) ditampilkan secara struktur `grid` di dalam panel (Sheet / Modal detail).

## 5. Standar Kode & Struktur Folder (Frontend)

Struktur ini memastikan kode tertata rapi (Feature-Driven Architecture):

```text
src/
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── (dashboard)/      # Protected routes (Dashboard, Master Data, dll)
│   └── auth/             # Login pages
├── components/
│   ├── ui/               # Shadcn UI base components
│   ├── layout/           # Sidebar, Header, Breadcrumbs
│   └── shared/           # Reusable components (misal: DataTable, DatePicker)
├── features/             # Modularized code by feature domain
│   ├── absensi/          # Components, Hooks, API calls khusus absensi
│   ├── checksheet/
│   ├── master-data/
│   └── reports/          # Menampung standardisasi laporan PDF viewer & grid
├── lib/                  # Utility functions (Axios instance, Zod schemas, utils.ts)
├── store/                # Zustand stores
└── types/                # Global TypeScript definitions
```

## 6. Persiapan Infrastruktur (Koneksi Backend)

- **Axios Interceptors:** Meng-handle error terpusat. Jika Backend mengembalikan 400/500, otomatis memunculkan `Toast` dengan pesan dari server.
- **Server Actions vs Client Fetch:** Menggunakan React Query untuk list data agar cache berjalan optimal di sisi klien dan mendukung paginasi instan. Menggunakan Server Actions untuk inisialisasi layout dasar.
- **Environment Variables:** `NEXT_PUBLIC_API_URL` mengarah ke Docker backend (misal: `http://localhost:3000/api/v1`).
