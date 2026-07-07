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

export default router;
