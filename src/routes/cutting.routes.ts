import { Router } from "express";
import * as cuttingController from "../controllers/cutting.controller";
import { createBatchSchema } from "../dtos/cutting.dto";
import { validate } from "../middlewares/validate";

/**
 * @swagger
 * tags:
 *   name: Cutting
 *   description: API endpoints for managing cutting batches
 */
const router = Router();

/**
 * @swagger
 * /api/v1/cutting/batches:
 *   get:
 *     summary: Get all cutting batches
 *     tags: [Cutting]
 *     responses:
 *       200:
 *         description: A list of cutting batches
 */
router.get("/batches", cuttingController.getBatches);

/**
 * @swagger
 * /api/v1/cutting/batches:
 *   post:
 *     summary: Create a new cutting batch
 *     tags: [Cutting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_sesi
 *               - material_id
 *             properties:
 *               id_sesi:
 *                 type: string
 *                 format: uuid
 *               material_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Created cutting batch
 */
router.post(
	"/batches",
	validate(createBatchSchema),
	cuttingController.createBatch,
);

export default router;
