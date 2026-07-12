# DESIGN.md - InSpectraServer (Backend Architecture & Infrastructure)

Dokumen ini mendeskripsikan arsitektur backend, infrastruktur, dan desain sistem dari layanan `InSpectraServer`. Pengembangan berfokus pada **Hardening Input**, stabilitas data, dan API yang robust untuk melayani klien Android (Jetpack Compose). 

**Seluruh jejak integrasi atau rancangan web/frontend telah dihapus dari repositori ini sesuai direktif.**

## 1. Arsitektur & Teknologi Utama
Backend InSpectra dibangun untuk skalabilitas tinggi, kemudahan integrasi dengan ekosistem Node.js, dan keandalan data pada sisi server sebelum berinteraksi dengan database (Supabase).

- **Runtime & Bahasa**: Node.js dengan TypeScript.
- **Framework API**: Express.js, dirancang stateless dan modular.
- **ORM & Database**: Prisma ORM, terhubung ke Supabase (PostgreSQL).
- **Validasi**: Zod digunakan untuk validasi skema input (body, query, params) pada middleware.
- **Testing**: Vitest untuk Unit Test & E2E Test (Pyramid Testing).
- **Infrastruktur**: Containerized dengan Docker (Dockerfile & docker-compose.yml siap).

## 2. Hardening Input & Validasi

Sistem ini didesain mengutamakan keandalan input dari lantai produksi (E-Checksheet).
- **Atomic Transactions**: Batch submit checksheet dijalankan dalam Prisma `$transaction`. Jika satu item gagal (misalnya karena defect tidak terdaftar atau perhitungan jumlah NG tidak cocok), seluruh batch akan di-_rollback_ untuk mencegah _partial data corruption_.
- **Zod Middleware**: Validasi ketat di level terluar (Controller). Jika payload tidak sesuai skema (misalnya properti wajib tidak ada, atau tipe data salah), middleware akan menolak request (HTTP 400) dan mengembalikan array error yang terstruktur sebelum membebani database.
- **Data Integrity**: Menjamin bahwa referensi dari E-Checksheet (seperti `uniq_no` pada part dan `id_defect`) benar-benar ada dan dalam status `aktif` di master data sebelum data checksheet disimpan.

## 3. Strategi Caching & Delta Sync (Offline-First Support)

Untuk mencegah bottleneck dan eksploitasi limit _Free Tier_ Supabase (HTTP 429), pengambilan data referensial dioptimasi di sisi server.
- **In-Memory Reference Cache**: Menggunakan implementasi `node-cache` (via `ReferenceCache` util) dengan TTL 300 detik (5 menit).
- **Cache Invalidation**: Setiap operasi mutasi (Create, Update, Delete) pada entitas master (Part, Material, Defect) akan secara otomatis membersihkan cache yang terkait agar sistem segera menyajikan data yang paling _up-to-date_.
- **Delta Sync Support**: API List / GET untuk entitas master mendukung query parameter `last_sync_time`. Sistem hanya akan mengembalikan data yang nilai `diperbarui_pada` lebih besar dari `last_sync_time`, meminimalisir payload jaringan untuk klien Android.

## 4. Keamanan & Quota Management

- **Rate Limiting**: `express-rate-limit` dikonfigurasi untuk membatasi maksimal 100 request per 15 menit per IP (dapat disesuaikan di Production). Hal ini untuk mencegah serangan DDoS atau _infinite loop_ dari client yang salah konfigurasi.
- **Error Handling & Logging**: Menggunakan `pino` untuk logging JSON yang terstruktur. `pino-http` merekam semua request/response. Error di-_sanitize_ sebelum dikembalikan ke klien; pesan error mendetail (stacktrace) tidak pernah bocor ke environment production.
- **Sanitization**: Informasi sensitif dienkripsi dan diatur melalui `.env` yang tidak di-commit ke Git.

## 5. Struktur Database & Model (Prisma)

- **`m_part`, `m_material`, `m_defect`**: Tabel Master Data utama. Memiliki flag `aktif` (Soft Delete) agar integritas relasional data transaksional yang lama tidak rusak.
- **`t_checksheet`, `t_checksheet_item`, `t_checksheet_defect`**: Tabel Transaksi. Merupakan hirarki _One-to-Many_ untuk menyimpan sesi inspeksi QC secara terstruktur.
- **Time Slots**: E-Checksheet membagi waktu operasi dalam 4 slot (Slot 1, Slot 2, Slot 3, Overtime) untuk memudahkan _tracing_ Pareto defect berdasarkan periode waktu di dalam satu shift.

## 6. Integrasi Klien (Android)

Klien utama dari API ini adalah aplikasi **Android InSpectra** (Jetpack Compose, Ktor Client). API ini didesain sesuai panduan arsitektur Android:
- Response menggunakan bahasa Indonesia standar untuk pesan validasi sehingga klien tidak perlu melakukan _mapping_ translasi pesan error (contoh: "Part tidak ditemukan atau tidak aktif").
- Endpoint dikelompokkan dengan versi API, misal `/api/v1/masterdata/...` dan `/api/v1/checksheet/...`.

*(Catatan: Fitur dashboard dan statistik agregasi saat ini tidak ada/dihapus dari prioritas sistem untuk memfokuskan repository pada **Hardening Input**).*
