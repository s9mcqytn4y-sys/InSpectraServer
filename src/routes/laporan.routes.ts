import { Router } from "express";
import * as laporanController from "../controllers/laporan.controller";
import { createLaporanSchema } from "../dtos/laporan.dto";
import { validate } from "../middlewares/validate";

/**
 * @swagger
 * tags:
 *   name: Laporan
 *   description: API endpoints for managing production reports
 */
const router = Router();

/**
 * @swagger
 * /api/v1/laporan:
 *   get:
 *     summary: Get all production reports
 *     tags: [Laporan]
 *     responses:
 *       200:
 *         description: A list of production reports
 */
router.get("/", laporanController.getLaporan);

/**
 * @swagger
 * /api/v1/laporan:
 *   post:
 *     summary: Create a new production report
 *     tags: [Laporan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tanggal
 *               - tipe_proses
 *             properties:
 *               tanggal:
 *                 type: string
 *                 format: date-time
 *               tipe_proses:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created production report
 */
router.post(
	"/",
	validate(createLaporanSchema),
	laporanController.createLaporan,
);

export default router;
