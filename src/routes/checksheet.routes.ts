import { Router } from "express";
import * as checksheetController from "../controllers/checksheet.controller";
import { startSessionSchema, submitDefectSchema } from "../dtos/checksheet.dto";
import { validate } from "../middlewares/validate";

/**
 * @swagger
 * tags:
 *   name: Checksheet
 *   description: API endpoints for managing checksheet sessions and defects
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
 * /api/v1/checksheet/defect:
 *   post:
 *     summary: Submit a defect for a session
 *     tags: [Checksheet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - defectId
 *               - quantity
 *             properties:
 *               sessionId:
 *                 type: string
 *                 format: uuid
 *               defectId:
 *                 type: string
 *               quantity:
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
