import { Router } from "express";
import * as uploadController from "../controllers/upload.controller";
import { upload } from "../middlewares/upload";

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: API endpoints for file uploads
 */
const router = Router();

/**
 * @swagger
 * /api/v1/upload:
 *   post:
 *     summary: Upload a file (image)
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
router.post("/", upload.single("file"), uploadController.uploadFile);

export default router;
