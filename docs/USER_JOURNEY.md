# USER_JOURNEY.md - Alur Kerja Operator InSpectra

Panduan alur interaksi pengguna (UX Flow) untuk *Stitch by Google* atau pengembang frontend saat membangun Web App InSpectra.

## Alur Utama: Inspeksi Harian

1. **Splash Screen / Inisialisasi**
   - Menampilkan logo aplikasi InSpectra selama 1-2 detik.
   - Tidak melakukan operasi jaringan berat. Hanya untuk inisialisasi UI dan mengecek status *cache* lokal.

2. **Dashboard / Workspace**
   - Layar operasional utama.
   - Menampilkan metrik *Takt Time* dan jumlah produksi/inspeksi saat ini secara *Real-Time*.
   - Tombol utama yang besar (Touch Target 48x48dp+) untuk memulai sesi **Lembar Periksa (E-Checksheet)**.

3. **Lembar Periksa (E-Checksheet)**
   - Operator memilih *Master Part* dan *Line Process*.
   - **Data Induk** ditarik dari *In-Memory Reference Cache* (cepat).
   - Form input berfokus pada kecepatan: Input angka defect (*NG*).
   - Validasi instan (Contoh: Total NG tidak boleh melebihi Total Diperiksa).

4. **Kirim Data (Submit/Sync)**
   - Operator menekan tombol "Kirim" (Warna Aksen: Amber/Biru).
   - Selama proses pengiriman, UI dikunci (disabled) untuk mencegah *double-submit*.
   - Jika berhasil: Notifikasi hijau, form di-reset untuk batch berikutnya.
   - Jika gagal/offline: Notifikasi merah jelas dengan pesan penyebab.

5. **Riwayat & Laporan**
   - Operator dapat melihat riwayat inspeksi hari ini.
   - Tampilan berupa tabel/daftar (List) padat yang dapat dengan mudah di-*scroll*.
   - Terdapat ringkasan Pareto Defect (jenis defect terbanyak) untuk tindak lanjut QC.
