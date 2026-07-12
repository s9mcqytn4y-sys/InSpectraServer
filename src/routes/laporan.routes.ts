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
 */
router.get("/", validate(getLaporanQuerySchema), laporanController.getLaporan);

export default router;
