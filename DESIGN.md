# DESIGN.md - Frontend / UI-UX Perspective (2026 Standards)

Dokumen ini mendeskripsikan bagaimana **Frontend React JS (atau Next.js) 2026** berinteraksi dengan layanan backend `InSpectraServer`. Backend ini dirancang khusus untuk mempermudah pekerjaan developer Frontend.

## 1. Arsitektur Komunikasi (Data Fetching)
Pada era modern (React 2026), *server components* dan pustaka *async data fetching* seperti TanStack Query (React Query) menjadi standar. 
Backend InSpectra memberikan kemudahan melalui:
- **Standarisasi Response**: Setiap API selalu mengembalikan struktur `{ status, metadata, data }`. Frontend bisa membuat interceptor atau pembungkus `fetch` global dengan mudah tanpa harus melakukan *type guard* berulang.
- **Pesan Error yang Langsung Bisa Ditampilkan (Ready-to-Show)**: Validasi *Zod* di backend akan langsung mengembalikan pesan error dalam Bahasa Indonesia yang deskriptif ("Nama part wajib diisi"). Frontend dapat langsung memetakan pesan ini (misal via React Hook Form) ke label pesan *error* UI.

## 2. Pengalaman Pengguna (User Experience - UX)
### 2.1 Formulir Entri Data (Data Entry Forms)
Formulir master data, laporan, maupun form operasional QC di lapangan dituntut untuk *responsive* dan tahan *error*.
- **Dropdown List**: Frontend mengambil data dari `/api/v1/masterdata/parts` dan langsung menggunakan parameter `uniqNo` sebagai kunci relasi.
- **Validasi Sinkron**: Zod memastikan *rule* yang dijalankan oleh Frontend (sebelum submit) selaras dan terlindungi kembali di level Backend (pada saat submit).
- **Offline / Sync Support**: Endpoint dirancang *stateless* dan menerima ID sesi (UUID) dari sisi klien (Android/Web), memungkinkan fitur sinkronisasi *offline-first* dari aplikasi tablet di lantai produksi.

### 2.2 Upload Gambar (Part Images)
Pengunggahan visual panduan kerja (Part Guide) diakomodasi melalui endpoint `POST /api/v1/masterdata/upload` menggunakan `multipart/form-data`. Frontend bisa mengimplementasikan pratinjau (preview) unggahan, mengirim gambar, lalu menyimpan `url` balikan ke payload master part `POST /api/v1/masterdata/parts`.

## 3. Komponen Frontend yang Direkomendasikan
Untuk konsumsi data dari InSpectraServer, UI Designer dan Frontend Dev disarankan menggunakan:
- **Tabel Dinamis**: Dilengkapi dengan server-side pagination, searching, dan filtering (mendatang).
- **Toast Notifications**: Notifikasi ditarik langsung dari atribut `message` pada status respons backend ketika error terjadi.
- **Dashboard Statistik**: Endpoint agregasi laporan (TBD) dirancang untuk mengembalikan bentuk yang siap diplot menjadi grafik (Bar Chart, Line Chart) menggunakan *Recharts* atau pustaka modern sejenisnya.

## 4. Antisipasi Jangka Panjang
- **Perubahan Skema**: API versi 1 (/api/v1/) akan dikunci agar tidak merusak frontend yang *legacy*. Jika ada fitur masif baru, akan diisolasi ke /api/v2/.
- **State Management**: Karena Backend bersifat RESTful dengan pola resource yang terprediksi, manajemen status global (Redux/Zustand) disarankan hanya digunakan untuk *UI-state*. Urusan data server sepenuhnya diserahkan kepada pustaka asinkron spesifik seperti SWR/React Query.
