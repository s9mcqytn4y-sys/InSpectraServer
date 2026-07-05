import { Router } from "express";
import * as checksheetController from "../controllers/checksheet.controller";
import {
	startSessionSchema,
	submitDefectSchema,
	submitItemCheckSchema,
} from "../dtos/checksheet.dto";
import { validate } from "../middlewares/validate";

/**
 * @swagger
 * tags:
 *   name: Checksheet
 *   description: API endpoints for managing checksheet sessions, items, and defects
 */
const router = Router();

/**
 * @swagger
 * /api/v1/checksheet/sessions:
 *   get:
 *     summary: Get all checksheet sessions
 *     tags: [Checksheet]
 *     responses:
 *       200:
 *         description: A list of sessions
 */
router.get("/sessions", checksheetController.getSessions);

/**
 * @swagger
 * /api/v1/checksheet/sessions:
 *   post:
 *     summary: Start a new checksheet session
 *     tags: [Checksheet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipe_proses
 *               - nama_shift
 *               - nama_operator
 *             properties:
 *               tipe_proses:
 *                 type: string
 *               nama_shift:
 *                 type: string
 *               nama_operator:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created checksheet session
 */
router.post(
	"/sessions",
	validate(startSessionSchema),
	checksheetController.startSession,
);

/**
 * @swagger
 * /api/v1/checksheet/item:
 *   post:
 *     summary: Submit an item check for a session
 *     tags: [Checksheet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_sesi
 *               - uniq_no
 *               - jumlah_diperiksa
 *               - jumlah_ok
 *               - jumlah_ng
 *             properties:
 *               id_sesi:
 *                 type: string
 *                 format: uuid
 *               uniq_no:
 *                 type: string
 *               jumlah_diperiksa:
 *                 type: number
 *               jumlah_ok:
 *                 type: number
 *               jumlah_ng:
 *                 type: number
 *               catatan:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item check submitted successfully
 */
router.post(
	"/item",
	validate(submitItemCheckSchema),
	checksheetController.submitItemCheck,
);

/**
 * @swagger
 * /api/v1/checksheet/defect:
 *   post:
 *     summary: Submit a defect for a checksheet item
 *     tags: [Checksheet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_item
 *               - id_defect
 *               - nama_defect_snapshot
 *               - kategori
 *               - jumlah
 *             properties:
 *               id_item:
 *                 type: string
 *                 format: uuid
 *               id_defect:
 *                 type: string
 *               nama_defect_snapshot:
 *                 type: string
 *               kategori:
 *                 type: string
 *               jumlah:
 *                 type: number
 *     responses:
 *       200:
 *         description: Defect submitted successfully
 */
router.post(
	"/defect",
	validate(submitDefectSchema),
	checksheetController.submitDefect,
);

export default router;
