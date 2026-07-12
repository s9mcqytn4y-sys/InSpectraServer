import { Router } from "express";
import * as attendanceController from "../controllers/attendance.controller";
import { createEmployeeSchema } from "../dtos/attendance.dto";
import { validate } from "../middlewares/validate";

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: API endpoints for managing employee attendance and master data
 */
const router = Router();

/**
 * @swagger
 * /api/v1/attendance/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Attendance]
 *     responses:
 *       200:
 *         description: A list of employees
 */
router.get("/employees", attendanceController.getEmployees);

/**
 * @swagger
 * /api/v1/attendance/employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama_lengkap
 *               - tipe_pekerja
 *               - line_process
 *             properties:
 *               nama_lengkap:
 *                 type: string
 *               tipe_pekerja:
 *                 type: string
 *               line_process:
 *                 type: string
 *               no_reg:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created employee
 */
router.post(
	"/employees",
	validate(createEmployeeSchema),
	attendanceController.createEmployee,
);

/**
 * @swagger
 * /api/v1/attendance/reports:
 *   get:
 *     summary: Get attendance reports with optional PDF export
 *     tags: [Attendance]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: lineProcess
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: exportPdf
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Report data or PDF file
 */
router.get("/reports", attendanceController.getAttendanceReport);

export default router;
