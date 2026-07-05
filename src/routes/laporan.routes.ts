import { Router } from "express";
import * as laporanController from "../controllers/laporan.controller";
import {
	createLaporanDetailSchema,
	createLaporanSchema,
	getLaporanQuerySchema,
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
 * /api/v1/laporan/export:
 *   get:
 *     summary: Export production reports to Excel
 *     tags: [Laporan]
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
 *     responses:
 *       200:
 *         description: Excel file generated successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
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
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by tipe proses
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
 *     responses:
 *       200:
 *         description: A list of production reports
 */
router.get("/", validate(getLaporanQuerySchema), laporanController.getLaporan);

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
 *               mp_direct:
 *                 type: number
 *               mp_indirect:
 *                 type: number
 *               jkn_hour:
 *                 type: number
 *               jkn_menit:
 *                 type: number
 *               ot_prod:
 *                 type: number
 *               ot_non:
 *                 type: number
 *     responses:
 *       201:
 *         description: Created production report
 */
router.post(
	"/",
	validate(createLaporanSchema),
	laporanController.createLaporan,
);

/**
 * @swagger
 * /api/v1/laporan/detail:
 *   post:
 *     summary: Create a new production report detail
 *     tags: [Laporan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_laporan
 *               - id_part
 *               - planning
 *               - actual
 *               - ng
 *             properties:
 *               id_laporan:
 *                 type: string
 *                 format: uuid
 *               id_part:
 *                 type: string
 *                 format: uuid
 *               planning:
 *                 type: number
 *               actual:
 *                 type: number
 *               ng:
 *                 type: number
 *     responses:
 *       201:
 *         description: Created production report detail
 */
router.post(
	"/detail",
	validate(createLaporanDetailSchema),
	laporanController.createLaporanDetail,
);

export default router;
