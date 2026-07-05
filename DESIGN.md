# DESIGN.md - UI/UX & Frontend Perspective (React JS 2026)

Dokumen ini mendeskripsikan panduan desain dan interaksi antara **Frontend React JS (atau Next.js App Router 2026)** dengan layanan backend `InSpectraServer`. InSpectra didesain dengan visi **Modern Web Apps**, memprioritaskan estetika premium, performa tinggi, dan pengalaman pengguna yang luar biasa.

## 1. Filosofi & Estetika Desain (UI/UX 2026)
Antarmuka pengguna InSpectra harus terlihat sangat premium, dinamis, dan mengikuti tren desain 2026:
- **Glassmorphism & Depth**: Penggunaan panel semi-transparan dengan efek *blur* berlapis dan bayangan lembut (*soft shadows*) untuk menciptakan kedalaman hierarki visual.
- **Dark Mode First**: Desain optimal untuk tema gelap (Dark Mode) dengan palet warna HSL yang disesuaikan secara khusus. Hindari warna absolut (seperti merah atau biru murni). Gunakan skema monokromatik modern dengan aksen *vibrant* (misalnya *neon cyan* atau *electric purple*) pada interaksi kunci.
- **Tipografi Modern**: Menggunakan kombinasi font Sans-Serif geometris seperti **Inter**, **Outfit**, atau **Plus Jakarta Sans** untuk memberikan kesan teknikal namun tetap *humanist*.
- **Micro-Animations**: Setiap interaksi (hover, klik, submit) harus memberikan *feedback* visual yang mulus (transisi CSS/Framer Motion, durasi ~200-300ms).

## 2. Arsitektur Komunikasi (Data Fetching)
Standar React 2026 menggunakan *Server Components* dan pustaka *async data fetching* seperti **TanStack Query v5+** atau pustaka bawaan *framework*:
- **Standarisasi Response**: API secara konsisten mengembalikan `{ status, metadata, data }`. Frontend wajib mengimplementasikan *interceptor* global untuk mengekstrak data atau menangani error secara otomatis tanpa pengulangan kode.
- **Pesan Error Bahasa Indonesia**: Seluruh validasi backend (Zod) langsung mereturn pesan error yang siap ditampilkan (contoh: "ID Item tidak valid"). Hubungkan ini langsung dengan komponen Toast Notification (contoh: Sonner) atau pesan *inline* pada form.

## 3. Komponen Frontend Modern & UX
Pengembangan komponen frontend untuk QC dan Produksi harus tangguh (*robust*):
- **Formulir QC di Lapangan**: Didesain responsif (mobile/tablet first) dengan area sentuh yang luas (minimal 44x44px). 
- **Offline / Sync Support**: Menggunakan kapabilitas *Service Worker* dan penyimpanan lokal (IndexedDB) untuk memastikan entri *Checksheet* dan *Cutting Batch* tidak hilang jika koneksi lantai produksi terputus. Endpoint yang *stateless* dan berbasis UUID mendukung sinkronisasi data ini secara tangguh.
- **Tabel Data Virtual**: Penggunaan komponen *Virtual Scrolling* / *Windowing* (misal TanStack Virtual) pada halaman Laporan Produksi untuk merender ribuan baris data tanpa jeda (60 FPS).
- **Dashboard Analitik Dinamis**: Visualisasi *Rasio NG* menggunakan grafik modern (Recharts/Visx) dengan animasi masuk (*entry animation*) dan pop-up data (tooltip) interaktif saat di-hover.

## 4. Keamanan & Manajemen State
- **State Management**: Batasi penggunaan *global state* (Zustand/Redux) hanya untuk preferensi UI (tema, sidebar stat). Data yang diambil dari backend 100% dikelola oleh *Server State Library* (React Query/SWR).
- **Integritas Input**: Front-end wajib memvalidasi data menggunakan Zod *schema* sebelum form dikirimkan, sehingga menghasilkan perlindungan berlapis (di level klien dan server) dan meminimalisir *round-trip* tak perlu.
- **Optimistic UI Updates**: Segala tindakan mutasi (seperti menambahkan *Defect* pada *Checksheet*) harus langsung tercermin di UI sebelum server merespons, untuk menciptakan persepsi aplikasi yang seketika (*instant*).

## 5. Fitur Baru: Upload, Paginasi, & Ekspor
- **File Upload Management**: Komponen upload foto (misalnya untuk defect) harus mendukung *drag-and-drop* dengan *preview* lokal menggunakan `URL.createObjectURL()`. Tampilkan *progress bar* yang responsif saat upload (`/api/v1/upload`), lalu simpan *url* balikan ke field `fotoUrl`.
- **Paginasi & Pencarian (Server-side)**: Data volume besar seperti Master Data dan Laporan ditarik dengan implementasi *Pagination* (contoh: `useInfiniteQuery` untuk mobile atau tabel berhalaman untuk desktop). Parameter pencarian (`search`) di-debounce selama ~300ms untuk mencegah *spamming* ke server.
- **Ekspor Excel**: Sediakan tombol *Export Laporan* yang jelas (ikon unduh) yang akan mengunduh format `.xlsx` (dari `/api/v1/laporan/export`). Berikan indikasi loading saat server sedang men-generate file.

