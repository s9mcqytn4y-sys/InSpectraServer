import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { getDashboardQuerySchema } from "../dtos/dashboard.dto";
import { validate } from "../middlewares/validate";

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API endpoints for dashboard aggregations and analytics
 */
const router = Router();

/**
 * @swagger
 * /api/v1/dashboard/top-defects:
 *   get:
 *     summary: Get top 5 defects
 *     tags: [Dashboard]
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
 *         description: Top 5 defects data
 */
router.get(
	"/top-defects",
	validate(getDashboardQuerySchema),
	dashboardController.getTopDefects,
);

/**
 * @swagger
 * /api/v1/dashboard/oee-metrics:
 *   get:
 *     summary: Get OEE metrics from Laporan Produksi
 *     tags: [Dashboard]
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
 *       - in: query
 *         name: tipe_proses
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OEE metrics calculation
 */
router.get(
	"/oee-metrics",
	validate(getDashboardQuerySchema),
	dashboardController.getOeeMetrics,
);

/**
 * @swagger
 * /api/v1/dashboard/ng-rate:
 *   get:
 *     summary: Get NG Rate (Global Reject Ratio)
 *     tags: [Dashboard]
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
 *       - in: query
 *         name: tipe_proses
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: NG Rate calculation
 */
router.get(
	"/ng-rate",
	validate(getDashboardQuerySchema),
	dashboardController.getNgRate,
);

export default router;
