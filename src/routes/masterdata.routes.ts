import { Router } from "express";
import { upload } from "../config/upload";
import * as masterDataController from "../controllers/masterdata.controller";
import {
	createDefectSchema,
	createMaterialSchema,
	createPartSchema,
} from "../dtos/masterdata.dto";
import { validate } from "../middlewares/validate";

/**
 * @swagger
 * tags:
 *   name: MasterData
 *   description: API endpoints untuk manajemen master data
 */

const router = Router();

/**
 * @swagger
 * /api/v1/masterdata/parts:
 *   get:
 *     summary: Mendapatkan semua daftar master part
 *     tags: [MasterData]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar part
 */
router.get("/parts", masterDataController.getParts);

/**
 * @swagger
 * /api/v1/masterdata/parts:
 *   post:
 *     summary: Menambahkan part baru
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
 *               part_no:
 *                 type: string
 *               name:
 *                 type: string
 *               model:
 *                 type: string
 *               customer:
 *                 type: string
 *               commodity:
 *                 type: string
 *               catatan:
 *                 type: string
 *               kode_internal:
 *                 type: string
 *     responses:
 *       201:
 *         description: Part berhasil ditambahkan
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
 *     summary: Mendapatkan semua daftar material
 *     tags: [MasterData]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar material
 */
router.get("/materials", masterDataController.getMaterials);

/**
 * @swagger
 * /api/v1/masterdata/materials:
 *   post:
 *     summary: Menambahkan material baru
 *     tags: [MasterData]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               kategori_material:
 *                 type: string
 *               satuan:
 *                 type: string
 *               spec_ringkas:
 *                 type: string
 *               supplier_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Material berhasil ditambahkan
 */
router.post(
	"/materials",
	validate(createMaterialSchema),
	masterDataController.createMaterial,
);

/**
 * @swagger
 * /api/v1/masterdata/defects:
 *   get:
 *     summary: Mendapatkan semua daftar jenis defect
 *     tags: [MasterData]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar defect
 */
router.get("/defects", masterDataController.getDefects);

/**
 * @swagger
 * /api/v1/masterdata/defects:
 *   post:
 *     summary: Menambahkan jenis defect baru
 *     tags: [MasterData]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_defect
 *               - name
 *               - category
 *             properties:
 *               id_defect:
 *                 type: string
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [MATERIAL, PROSES]
 *               deskripsi:
 *                 type: string
 *               severity_default:
 *                 type: number
 *     responses:
 *       201:
 *         description: Defect berhasil ditambahkan
 */
router.post(
	"/defects",
	validate(createDefectSchema),
	masterDataController.createDefect,
);

/**
 * @swagger
 * /api/v1/masterdata/upload:
 *   post:
 *     summary: Upload gambar/foto part
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
 *         description: Berhasil mengunggah gambar
 */
router.post(
	"/upload",
	upload.single("image"),
	masterDataController.uploadImage,
);

export default router;
