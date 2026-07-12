import { Router } from "express";
import * as laporanController from "../controllers/laporan.controller";
import {
	getLaporanQuerySchema,
	submitLaporanHarianSchema,
} from "../dtos/laporan.dto";
import { validate } from "../middlewares/validate";

/**
 * @swagger
 * tags:
 *   name: Laporan
 *   description: API endpoints for managing production reports and details
 */
const router = Router();

/**
 * @swagger
 * /api/v1/laporan/submit-harian:
 *   post:
 *     summary: Submit production report and details (Daily)
 *     tags: [Laporan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tanggal, tipe_proses, details]
 *             properties:
 *               tanggal: { type: string, format: date, example: "2026-07-10" }
 *               tipe_proses: { type: string, example: "PRESS" }
 *               mp_direct: { type: integer }
 *               mp_indirect: { type: integer }
 *               details:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_part: { type: string, format: uuid }
 *                     planning: { type: integer }
 *                     actual: { type: integer }
 *                     ng: { type: integer }
 *     responses:
 *       201:
 *         description: Laporan harian berhasil disimpan
 */
router.post(
	"/submit-harian",
	validate(submitLaporanHarianSchema),
	laporanController.submitLaporanHarian,
);

/**
 * @swagger
 * /api/v1/laporan/export:
 *   get:
 *     summary: Export production reports to Excel
 *     tags: [Laporan]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Excel file generated successfully
 */
router.get("/export", laporanController.exportLaporan);

/**
 * @swagger
 * /api/v1/laporan:
 *   get:
 *     summary: Get all production reports
 *     tags: [Laporan]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by tipe_proses
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: exportPdf
 *         schema:
 *           type: boolean
 *         description: Set to true to export the result as a PDF file
 *     responses:
 *       200:
 *         description: List of reports or PDF file
 */
router.get("/", validate(getLaporanQuerySchema), laporanController.getLaporan);

export default router;
