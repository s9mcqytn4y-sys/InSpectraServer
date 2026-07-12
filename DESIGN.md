# DESIGN.md - Panduan UI/UX InSpectra (Frontend Web App)

Dokumen ini adalah acuan mutlak bagi **Stitch by Google** (atau AI Agent Frontend) untuk men-generate antarmuka pengguna (UI/UX) aplikasi InSpectra versi Web.
> **Note:** Dokumen Arsitektur Backend telah dipindahkan ke `docs/BACKEND_ARCHITECTURE.md`.

## 1. Tujuan Desain Utama (Industrial Workspace)
InSpectra Web App bukan halaman pemasaran/landing page. Ini adalah aplikasi operasional berdensitas data tinggi (*High Data Density*) untuk lantai produksi.
- **Takt Time Visual:** Operator harus bisa membaca status Andon, data part, dan total defect dalam < 1.5 detik.
- **Anti-Lag Form:** Input kuantitas NG dan sinkronisasi status lokal tidak boleh memicu frame drop.
- **Jujur Terhadap Data:** Jika data kosong, tampilkan "Belum ada data". Dilarang menggunakan placeholder palsu (*Lorem Ipsum*).

## 2. Sistem Warna (Dark SaaS & Adaptive Theme)
Desain wajib responsif terhadap mode gelap/terang, namun prioritas utamanya adalah lingkungan pencahayaan pabrik yang adaptif.

### A. Background & Surface
- Gunakan palet abu-abu batu bara / *charcoal matte* untuk *surface* (`surfaceContainer`, `surfaceContainerHigh`).
- **DILARANG** menggunakan warna hitam solid (`#000000`) atau putih pekat (`#FFFFFF`) karena dapat memicu kelelahan mata (*eye strain*).

### B. Pemisah & Kontainer
- Pemisah antar kontainer data menggunakan border tipis (1px solid) dengan warna yang rendah kontrasnya terhadap background (`outlineVariant`).
- JANGAN menggunakan efek blur, shadow/box-shadow tebal yang tidak wajar. Gunakan tonal elevation ringan.

### C. Aksen Interaktif & Andon
- **Primary / CTA:** Gunakan warna **Amber (Kuning Kunyit)** atau **Bright Cobalt Blue** secara selektif HANYA untuk tombol aksi (Simpan, Kirim).
- **Abnormal (Andon / Defect):** Gunakan container berwarna `errorContainer` (Semi-transparan merah) dan teks `onErrorContainer`.

## 3. Tipografi & Bahasa UI
- Font: Modern Sans Serif (Inter, Roboto, atau Outfit).
- Hierarki: Gunakan proporsi tipografi Material 3 yang jelas (Title untuk Header Kartu, Label untuk Metadata).
- Semua Bahasa UI *End-User* wajib Bahasa Indonesia standar industri:
  - Form Checksheet -> **Lembar Periksa**
  - Master Data -> **Data Induk**
  - Defect/Reject -> **Defect** (atau Temuan NG)
  - Submit -> **Kirim**

## 4. Anatomi Komponen & Layout
### Card Blueprint
Setiap entitas utama (Part, Material, Slot Waktu, Laporan) ditampilkan dalam Kartu (Card) bersudut melengkung (radius sedang, misal `1rem`), ber-border tipis, dan tata letak internal vertikal-horizontal yang proporsional (memanfaatkan `flex` atau `grid`).

### Lembar Periksa (E-Checksheet Form)
- **Sticky Summary:** Ringkasan akumulasi total kuantitas OK/NG harus tetap terlihat (*sticky header* atau *sidebar*).
- **Inline Validation:** Validasi angka (misal tidak boleh lebih dari total produksi) muncul persis di bawah field terkait.

## 5. Manajemen State & Skeleton
- **Loading:** Tampilkan Skeleton (kerangka statis), JANGAN spinner mutlak yang memicu lompatan layout.
- **Empty:** Teks jujur "Belum ada data".
- **Error:** Tampilkan banner error berwarna Andon merah yang jelas + tombol Retry.

*Generate komponen frontend dengan mengacu penuh pada pedoman estetika pabrik modern ini.*
