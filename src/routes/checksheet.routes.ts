import { Router } from "express";
import * as checksheetController from "../controllers/checksheet.controller";
import {
	startSessionSchema,
	submitBatchSchema,
	submitDefectSchema,
	submitItemCheckSchema,
} from "../dtos/checksheet.dto";
import { validate } from "../middlewares/validate";

/**
 * @swagger
 * tags:
 *   name: Checksheet
 *   description: API endpoint untuk mengelola sesi, item, defect, dan batch submit E-Checksheet
 */
const router = Router();

/**
 * @swagger
 * /api/v1/checksheet/slots:
 *   get:
 *     summary: Mendapatkan daftar slot waktu pemeriksaan
 *     tags: [Checksheet]
 *     parameters:
 *       - in: query
 *         name: tipe_proses
 *         schema:
 *           type: string
 *           enum: [PRESS, CUTTING, SEWING, QUALITY_CONTROL]
 *         description: Filter berdasarkan tipe proses
 *     responses:
 *       200:
 *         description: Daftar slot waktu berhasil diambil
 */
router.get("/slots", checksheetController.getSlotWaktu);

/**
 * @swagger
 * /api/v1/checksheet/sessions:
 *   get:
 *     summary: Mendapatkan semua sesi checksheet dengan paginasi
 *     tags: [Checksheet]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Halaman ke-n
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah data per halaman
 *       - in: query
 *         name: tipe_proses
 *         schema:
 *           type: string
 *         description: Filter berdasarkan tipe proses
 *       - in: query
 *         name: tanggal
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filter berdasarkan tanggal (format: YYYY-MM-DD)"
 *       - in: query
 *         name: exportPdf
 *         schema:
 *           type: boolean
 *         description: "Export data to PDF format if true"
 *     responses:
 *       200:
 *         description: Daftar sesi berhasil diambil atau PDF diunduh
 */
router.get("/sessions", checksheetController.getSessions);

/**
 * @swagger
 * /api/v1/checksheet/sessions:
 *   post:
 *     summary: Memulai sesi checksheet baru (single session)
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
 *             properties:
 *               tipe_proses:
 *                 type: string
 *                 example: PRESS
 *               nama_shift:
 *                 type: string
 *                 example: SHIFT_1
 *               nama_operator:
 *                 type: string
 *               nama_line:
 *                 type: string
 *               device_id:
 *                 type: string
 *               app_version:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sesi checksheet berhasil dibuat
 */
router.post(
	"/sessions",
	validate(startSessionSchema),
	checksheetController.startSession,
);

/**
 * @swagger
 * /api/v1/checksheet/submit-batch:
 *   post:
 *     summary: Submit batch checksheet (sesi + item + defect + slot dalam 1 request)
 *     tags: [Checksheet]
 *     description: |
 *       Endpoint utama untuk mengirim seluruh data checksheet dalam satu transaksi database.
 *       Cocok untuk sinkronisasi data offline (mobile/tablet) ke server.
 *
 *       **Validasi Business Logic:**
 *       - Semua `uniq_no` harus valid dan aktif di master part
 *       - Semua `id_defect` harus valid dan aktif di master defect
 *       - `jumlah_ok + jumlah_ng <= jumlah_diperiksa` per item
 *       - Total kuantitas defect tidak boleh melebihi `jumlah_ng` item
 *       - Total alokasi slot per defect harus sama dengan `jumlah` defect
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session
 *               - items
 *             properties:
 *               session:
 *                 type: object
 *                 required: [tipe_proses, nama_shift]
 *                 properties:
 *                   tipe_proses:
 *                     type: string
 *                     example: PRESS
 *                   nama_shift:
 *                     type: string
 *                     example: SHIFT_1
 *                   nama_operator:
 *                     type: string
 *                   nama_line:
 *                     type: string
 *                   device_id:
 *                     type: string
 *                   app_version:
 *                     type: string
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [uniq_no, jumlah_diperiksa, jumlah_ok, jumlah_ng]
 *                   properties:
 *                     uniq_no:
 *                       type: string
 *                       example: PR-001
 *                     jumlah_diperiksa:
 *                       type: integer
 *                       example: 100
 *                     jumlah_ok:
 *                       type: integer
 *                       example: 95
 *                     jumlah_ng:
 *                       type: integer
 *                       example: 5
 *                     catatan:
 *                       type: string
 *                     defects:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required: [id_defect, nama_defect_snapshot, kategori, jumlah]
 *                         properties:
 *                           id_defect:
 *                             type: string
 *                             example: D01
 *                           nama_defect_snapshot:
 *                             type: string
 *                             example: Goresan Dalam (Scratch)
 *                           kategori:
 *                             type: string
 *                             enum: [MATERIAL, PROSES]
 *                           jumlah:
 *                             type: integer
 *                             example: 3
 *                           fotoUrl:
 *                             type: string
 *                           slots:
 *                             type: array
 *                             items:
 *                               type: object
 *                               required: [slot_waktu_id, jumlah]
 *                               properties:
 *                                 slot_waktu_id:
 *                                   type: string
 *                                   format: uuid
 *                                 jumlah:
 *                                   type: integer
 *     responses:
 *       201:
 *         description: Batch checksheet berhasil disimpan
 *       400:
 *         description: Validasi gagal (part tidak valid, defect tidak valid, dll)
 *       422:
 *         description: Business rule violation (jumlah tidak konsisten)
 */
router.post(
	"/submit-batch",
	validate(submitBatchSchema),
	checksheetController.submitBatch,
);

/**
 * @swagger
 * /api/v1/checksheet/item:
 *   post:
 *     summary: Submit item check tunggal untuk sebuah sesi
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
 *         description: Item check berhasil disimpan
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
 *     summary: Submit defect tunggal untuk sebuah item check
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
 *                 enum: [MATERIAL, PROSES]
 *               jumlah:
 *                 type: number
 *               fotoUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Defect berhasil disimpan
 */
router.post(
	"/defect",
	validate(submitDefectSchema),
	checksheetController.submitDefect,
);

export default router;
