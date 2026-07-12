import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { getDashboardQuerySchema } from "../dtos/dashboard.dto";
import { validate } from "../middlewares/validate";

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API endpoint untuk agregasi, analitik, dan visualisasi data produksi
 */
const router = Router();

/**
 * @swagger
 * /api/v1/dashboard/top-defects:
 *   get:
 *     summary: Top 5 defect terbanyak dari data E-Checksheet
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: "Tanggal mulai filter (ISO 8601: 2026-07-01T00:00:00Z)"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: "Tanggal selesai filter"
 *     responses:
 *       200:
 *         description: Daftar top defect berhasil diambil
 */
router.get(
	"/top-defects",
	validate(getDashboardQuerySchema),
	dashboardController.getTopDefects,
);

/**
 * @swagger
 * /api/v1/dashboard/oee-metrics:
 *   get:
 *     summary: Kalkulasi OEE (Overall Equipment Effectiveness) dari Laporan Produksi
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: tipe_proses
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nilai OEE berhasil dikalkulasi
 */
router.get(
	"/oee-metrics",
	validate(getDashboardQuerySchema),
	dashboardController.getOeeMetrics,
);

/**
 * @swagger
 * /api/v1/dashboard/ng-rate:
 *   get:
 *     summary: Rasio NG (Not Good) global dari data E-Checksheet
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: tipe_proses
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: NG Rate berhasil dikalkulasi
 */
router.get(
	"/ng-rate",
	validate(getDashboardQuerySchema),
	dashboardController.getNgRate,
);

/**
 * @swagger
 * /api/v1/dashboard/pareto:
 *   get:
 *     summary: Pareto Chart - Top N defect dikelompokkan per 4 slot waktu
 *     tags: [Dashboard]
 *     description: |
 *       Mengembalikan data Pareto siap pakai untuk frontend.
 *       Setiap defect disertai persentase dari total NG, serta jumlah per-slot waktu
 *       (SLOT_1: 08:00-12:00, SLOT_2: 13:00-15:30, SLOT_3: 16:00-17:00, OVERTIME: 17:00+).
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: tipe_proses
 *         schema:
 *           type: string
 *           enum: [PRESS, CUTTING, SEWING, QUALITY_CONTROL]
 *         description: Filter berdasarkan tipe proses
 *       - in: query
 *         name: top_n
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Jumlah Top-N defect yang diambil
 *     responses:
 *       200:
 *         description: Data Pareto berhasil diambil
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 pareto:
 *                   - id_defect: D01
 *                     nama_defect: Goresan Dalam (Scratch)
 *                     total: 45
 *                     persentase: 60.5
 *                     per_slot:
 *                       "08:00 - 12:00": 20
 *                       "13:00 - 15:30": 15
 *                       "16:00 - 17:00": 7
 *                       "17:00 - Selesai": 3
 *                 total_ng_keseluruhan: 74
 */
router.get(
	"/pareto",
	validate(getDashboardQuerySchema),
	dashboardController.getPareto,
);

/**
 * @swagger
 * /api/v1/dashboard/trends:
 *   get:
 *     summary: Tren Rasio NG harian dikelompokkan per slot waktu
 *     tags: [Dashboard]
 *     description: |
 *       Mengembalikan data tren NG per hari yang disertai breakdown per-slot waktu.
 *       Berguna untuk mendeteksi pola produksi (jam berapa paling banyak NG).
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: tipe_proses
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data tren NG harian berhasil diambil
 */
router.get(
	"/trends",
	validate(getDashboardQuerySchema),
	dashboardController.getTrends,
);

/**
 * @swagger
 * /api/v1/dashboard/trend-combo:
 *   get:
 *     summary: "Q-Gate Combo Chart — Bar (Total Check/NG) + Line (Defect Rate %)"
 *     tags: [Dashboard]
 *     description: |
 *       Data harian untuk Combo Chart Q-Gate Board.
 *       - `tipe_proses=PRESS` → hanya data PRESS
 *       - `tipe_proses=SEWING` → hanya data SEWING
 *       - Kosongkan `tipe_proses` → **GABUNGAN** semua proses (PRESS + SEWING + CUTTING)
 *
 *       Response mencakup `data_harian` (per tanggal) dan `ringkasan` (agregat global).
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: tipe_proses
 *         schema:
 *           type: string
 *           enum: [PRESS, CUTTING, SEWING, QUALITY_CONTROL]
 *         description: "Filter proses. Kosongkan untuk data GABUNGAN."
 *     responses:
 *       200:
 *         description: Data Combo Chart berhasil diambil
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 data_harian:
 *                   - tanggal: "2026-07-01"
 *                     total_check_pcs: 500
 *                     total_ng_pcs: 12
 *                     total_ok_pcs: 488
 *                     defect_rate_persen: 2.4
 *                     sesi_count: 3
 *                 ringkasan:
 *                   total_check_pcs: 15000
 *                   total_ng_pcs: 320
 *                   total_ok_pcs: 14680
 *                   defect_rate_persen: 2.133
 */
router.get(
	"/trend-combo",
	validate(getDashboardQuerySchema),
	dashboardController.getTrendCombo,
);

/**
 * @swagger
 * /api/v1/dashboard/pie-distribution:
 *   get:
 *     summary: "Q-Gate Pie Chart — Distribusi Semua Jenis Defect"
 *     tags: [Dashboard]
 *     description: |
 *       Distribusi proporsi setiap jenis defect dari total NG.
 *       - `tipe_proses=PRESS` → distribusi defect hanya di PRESS
 *       - `tipe_proses=SEWING` → distribusi defect hanya di SEWING
 *       - Kosongkan `tipe_proses` → **GABUNGAN** semua proses
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: tipe_proses
 *         schema:
 *           type: string
 *           enum: [PRESS, CUTTING, SEWING, QUALITY_CONTROL]
 *         description: "Filter proses. Kosongkan untuk data GABUNGAN."
 *     responses:
 *       200:
 *         description: Distribusi defect berhasil diambil
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 distribusi:
 *                   - id_defect: SEWING_PUTUS
 *                     nama_defect: Sewing Putus
 *                     jumlah: 48
 *                     persentase: 32.65
 *                   - id_defect: BRUDUL
 *                     nama_defect: Brudul
 *                     jumlah: 25
 *                     persentase: 17.01
 *                 total_ng_keseluruhan: 147
 */
router.get(
	"/pie-distribution",
	validate(getDashboardQuerySchema),
	dashboardController.getPieDistribution,
);

/**
 * @swagger
 * /api/v1/dashboard/top3-defects:
 *   get:
 *     summary: "Q-Gate Top 3 Defect + Breakdown Part Number"
 *     tags: [Dashboard]
 *     description: |
 *       Top 3 (atau Top-N) defect tertinggi beserta breakdown Part Number yang berkontribusi.
 *       Cocok untuk Pie Chart kanan Q-Gate Board + Tabel (Part Number | Nama Part | QTY).
 *       - `tipe_proses=PRESS` → Top 3 defect khusus PRESS
 *       - `tipe_proses=SEWING` → Top 3 defect khusus SEWING
 *       - Kosongkan `tipe_proses` → **GABUNGAN** (Top 3 dari semua proses)
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: tipe_proses
 *         schema:
 *           type: string
 *           enum: [PRESS, CUTTING, SEWING, QUALITY_CONTROL]
 *         description: "Filter proses. Kosongkan untuk data GABUNGAN."
 *       - in: query
 *         name: top_n
 *         schema:
 *           type: integer
 *           default: 3
 *         description: "Jumlah Top-N defect (default: 3)"
 *     responses:
 *       200:
 *         description: Top 3 defect + breakdown berhasil diambil
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 top3:
 *                   - rank: 1
 *                     id_defect: SEWING_PUTUS
 *                     nama_defect: Sewing Putus
 *                     total: 48
 *                     persentase: 62.34
 *                     breakdown_part:
 *                       - uniq_no: B35
 *                         part_no: "71695-VT070-C"
 *                         nama_part: "PROTECTOR, RR SEAT BACK"
 *                         jumlah: 24
 *                 total_ng_keseluruhan: 77
 */
router.get(
	"/top3-defects",
	validate(getDashboardQuerySchema),
	dashboardController.getTop3Defects,
);

export default router;
