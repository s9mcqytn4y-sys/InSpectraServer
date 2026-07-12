import { Router } from "express";
import { upload } from "../config/upload";
import * as masterDataController from "../controllers/masterdata.controller";
import {
	createDefectSchema,
	createMaterialSchema,
	createPartSchema,
	getMasterDataQuerySchema,
	updateDefectSchema,
	updateMaterialSchema,
	updatePartSchema,
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
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar part
 */
router.get(
	"/parts",
	validate(getMasterDataQuerySchema),
	masterDataController.getParts,
);

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
 * /api/v1/masterdata/parts/{uniqNo}:
 *   put:
 *     summary: Mengubah data part
 *     tags: [MasterData]
 *     parameters:
 *       - in: path
 *         name: uniqNo
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               commodity:
 *                 type: string
 *     responses:
 *       200:
 *         description: Part berhasil diubah
 */
router.put(
	"/parts/:uniqNo",
	validate(updatePartSchema),
	masterDataController.updatePart,
);

/**
 * @swagger
 * /api/v1/masterdata/parts/{uniqNo}:
 *   delete:
 *     summary: Menghapus data part (soft delete)
 *     tags: [MasterData]
 *     parameters:
 *       - in: path
 *         name: uniqNo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Part berhasil dihapus
 */
router.delete("/parts/:uniqNo", masterDataController.deletePart);

/**
 * @swagger
 * /api/v1/masterdata/materials:
 *   get:
 *     summary: Mendapatkan semua daftar material
 *     tags: [MasterData]
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
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar material
 */
router.get(
	"/materials",
	validate(getMasterDataQuerySchema),
	masterDataController.getMaterials,
);

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
 * /api/v1/masterdata/materials/{code}:
 *   put:
 *     summary: Mengubah data material
 *     tags: [MasterData]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               kategori_material:
 *                 type: string
 *     responses:
 *       200:
 *         description: Material berhasil diubah
 */
router.put(
	"/materials/:code",
	validate(updateMaterialSchema),
	masterDataController.updateMaterial,
);

/**
 * @swagger
 * /api/v1/masterdata/materials/{code}:
 *   delete:
 *     summary: Menghapus data material (soft delete)
 *     tags: [MasterData]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Material berhasil dihapus
 */
router.delete("/materials/:code", masterDataController.deleteMaterial);

/**
 * @swagger
 * /api/v1/masterdata/defects:
 *   get:
 *     summary: Mendapatkan semua daftar jenis defect
 *     tags: [MasterData]
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
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar defect
 */
router.get(
	"/defects",
	validate(getMasterDataQuerySchema),
	masterDataController.getDefects,
);

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
 * /api/v1/masterdata/defects/{id_defect}:
 *   put:
 *     summary: Mengubah data defect
 *     tags: [MasterData]
 *     parameters:
 *       - in: path
 *         name: id_defect
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Defect berhasil diubah
 */
router.put(
	"/defects/:id_defect",
	validate(updateDefectSchema),
	masterDataController.updateDefect,
);

/**
 * @swagger
 * /api/v1/masterdata/defects/{id_defect}:
 *   delete:
 *     summary: Menghapus data defect (soft delete)
 *     tags: [MasterData]
 *     parameters:
 *       - in: path
 *         name: id_defect
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Defect berhasil dihapus
 */
router.delete("/defects/:id_defect", masterDataController.deleteDefect);

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
