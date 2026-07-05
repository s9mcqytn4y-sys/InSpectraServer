import { Router } from "express";
import * as masterDataController from "../controllers/masterdata.controller";
import { createMaterialSchema, createPartSchema } from "../dtos/masterdata.dto";
import { validate } from "../middlewares/validate";

/**
 * @swagger
 * tags:
 *   name: MasterData
 *   description: API endpoints for managing master data
 */

const router = Router();

/**
 * @swagger
 * /api/v1/masterdata/parts:
 *   get:
 *     summary: Get all parts
 *     tags: [MasterData]
 *     responses:
 *       200:
 *         description: A list of parts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/parts", masterDataController.getParts);

/**
 * @swagger
 * /api/v1/masterdata/parts:
 *   post:
 *     summary: Create a new part
 *     tags: [MasterData]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uniqNo
 *               - name
 *               - commodity
 *             properties:
 *               uniqNo:
 *                 type: string
 *               name:
 *                 type: string
 *               commodity:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created part
 */
router.post(
	"/parts",
	validate(createPartSchema),
	masterDataController.createPart,
);

/**
 * @swagger
 * /api/v1/masterdata/materials:
 *   get:
 *     summary: Get all materials
 *     tags: [MasterData]
 *     responses:
 *       200:
 *         description: A list of materials
 */
router.get("/materials", masterDataController.getMaterials);

/**
 * @swagger
 * /api/v1/masterdata/materials:
 *   post:
 *     summary: Create a new material
 *     tags: [MasterData]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Created material
 */
router.post(
	"/materials",
	validate(createMaterialSchema),
	masterDataController.createMaterial,
);

import { upload } from "../config/upload";

/**
 * @swagger
 * /api/v1/masterdata/upload:
 *   post:
 *     summary: Upload an image file
 *     tags: [MasterData]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 */
router.post(
	"/upload",
	upload.single("image"),
	masterDataController.uploadImage,
);

export default router;
