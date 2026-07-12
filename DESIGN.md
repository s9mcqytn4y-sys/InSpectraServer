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

## 6. E-Checksheet: Batch Submit & Slot Waktu (Fase Transaksi)

Modul ini adalah inti dari InSpectra — data kualitas real-time dari lantai produksi.

### 6.1 Kontrak API: `POST /api/v1/checksheet/submit-batch`

Frontend (mobile/tablet Android) mengirim **satu request JSON** yang memuat seluruh sesi pemeriksaan. Server memproses semuanya dalam satu *database transaction* atomik.

**Struktur Payload:**
```json
{
  "session": {
    "tipe_proses": "PRESS",
    "nama_shift": "SHIFT_1",
    "nama_operator": "Budi Santoso",
    "nama_line": "LINE-A"
  },
  "items": [
    {
      "uniq_no": "PR-001",
      "jumlah_diperiksa": 100,
      "jumlah_ok": 95,
      "jumlah_ng": 5,
      "defects": [
        {
          "id_defect": "D01",
          "nama_defect_snapshot": "Goresan Dalam (Scratch)",
          "kategori": "PROSES",
          "jumlah": 3,
          "fotoUrl": "/public/uploads/foto-defect-123.jpg",
          "slots": [
            { "slot_waktu_id": "<uuid-PRESS_SHIFT_1_SLOT_1>", "jumlah": 2 },
            { "slot_waktu_id": "<uuid-PRESS_SHIFT_1_SLOT_2>", "jumlah": 1 }
          ]
        }
      ]
    }
  ]
}
```

**Business Logic Validasi (Server-side):**
- `jumlah_ok + jumlah_ng ≤ jumlah_diperiksa` per item
- Total `jumlah` semua defect ≤ `jumlah_ng` item
- Total `jumlah` semua slot dalam satu defect **harus sama persis** dengan `jumlah` defect
- Semua `uniq_no` harus valid di `m_part` dan `aktif: true`
- Semua `id_defect` harus valid di `m_defect` dan `aktif: true`

### 6.2 Desain 4 Time Slots

Setiap proses (PRESS, CUTTING, SEWING, QUALITY_CONTROL) memiliki 4 slot waktu dalam satu shift:

| Kode Slot | Label | Keterangan |
|---|---|---|
| `{PROSES}_SHIFT_1_SLOT_1` | 08:00 - 12:00 | Sesi pagi |
| `{PROSES}_SHIFT_1_SLOT_2` | 13:00 - 15:30 | Sesi siang setelah makan |
| `{PROSES}_SHIFT_1_SLOT_3` | 16:00 - 17:00 | Sesi sore |
| `{PROSES}_SHIFT_1_OVERTIME` | 17:00 - Selesai | Lembur |

**Cara frontend mendapatkan daftar slot:**
```
GET /api/v1/checksheet/slots?tipe_proses=PRESS
```

### 6.3 Desain Dashboard: Pareto, Trends & Analytics

**Q-Gate Board (Gambar 1) & Master Data Analitik:**
- **Combo Chart (`GET /api/v1/dashboard/trend-combo`)**: Mengembalikan data tren harian (Total Check/NG sebagai Bar, Defect Rate sebagai Line). Bisa difilter per `tipe_proses` (PRESS/SEWING) atau gabungan.
- **Pie Distribution (`GET /api/v1/dashboard/pie-distribution`)**: Distribusi proporsi (Pie chart kiri) dari semua jenis defect terhadap total NG.
- **Top 3 Defects (`GET /api/v1/dashboard/top3-defects`)**: Top 3 defect tertinggi (Pie chart kanan) beserta rincian breakdown _Part Number_ yang paling banyak menyumbang defect tersebut (Tabel Part).

**Analitik Lanjutan:**
- **Pareto Chart (`GET /api/v1/dashboard/pareto`)**: Top-N defect beserta breakdown `per_slot` waktu.
- **Trend NG Rate (`GET /api/v1/dashboard/trends`)**: NG rate per hari disertai breakdown overlay per slot waktu.

## 7. Desain Visual & UI/UX (Premium React 2026)

### 7.1 Skema Warna & Tema (Dark Mode First)
- **Primary**: `#0EA5E9` (Sky 500) - Digunakan untuk aksi utama, tombol submit, dan progress bar.
- **Secondary**: `#6366F1` (Indigo 500) - Digunakan untuk aksen grafik dan elemen navigasi.
- **Background (Dark)**: `#0F172A` (Slate 900) dengan overlay `#1E293B` (Slate 800) untuk card.
- **Surface**: Glassmorphism (Background: `rgba(30, 41, 59, 0.7)`, Backdrop Blur: `12px`).
- **Success**: `#10B981` (Emerald 500).
- **Danger**: `#EF4444` (Red 500) - Sangat kontras terhadap background gelap.

### 7.2 Tipografi & Ikonografi
- **Headings**: *Plus Jakarta Sans* (Semi-bold/Bold) untuk kesan modern dan lega.
- **Body**: *Inter* atau *Geist* (Medium) untuk legibilitas tinggi pada data tabel.
- **Icons**: *Lucide React* atau *Phosphor Icons* (Duo-tone style) dengan ketebalan stroke `1.5px`.

### 7.3 User Journey: QC Entry Flow
1. **Identifikasi**: Operator login/scan badge -> Pilih Line & Shift.
2. **Pilih Part**: Scan Kanban QR atau Cari Part -> Muncul mapping defect relevan.
3. **Input Check**: Masukkan jumlah OK/NG (Real-time NG Rate preview).
4. **Detail Defect**: Jika ada NG -> Pilih jenis defect (mapping otomatis) -> Masukkan Qty -> Alokasi Slot Waktu (otomatis disarankan berdasarkan jam saat ini) -> Upload Foto.
5. **Review**: Ringkasan batch (Total, OK, NG, % Defect) -> Submit.
6. **Confirmation**: Animasi sukses (Lottie) -> Data masuk ke Dashboard Global.

### 7.4 Robustness & Offline Support
- **State Persistence**: Menggunakan `TanStack Query` dengan `persistQueryClient` (Local Storage/IndexedDB).
- **Queue System**: Jika offline, request batch disimpan di `workbox-background-sync`.
- **UI Copy**: Gunakan bahasa yang teknikal namun jelas (Contoh: "Sinkronisasi Berhasil", "Alokasi Slot Tidak Sesuai").
