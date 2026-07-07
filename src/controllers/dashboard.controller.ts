import type { NextFunction, Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";
import { successResponse } from "../utils/ApiResponse";

export const getTopDefects = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const topDefects = await dashboardService.getTopDefects(req.query as any);
		res.json(successResponse(topDefects));
	} catch (error) {
		next(error);
	}
};

export const getOeeMetrics = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const oeeMetrics = await dashboardService.getOeeMetrics(req.query as any);
		res.json(successResponse(oeeMetrics));
	} catch (error) {
		next(error);
	}
};

export const getNgRate = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const ngRate = await dashboardService.getNgRate(req.query as any);
		res.json(successResponse(ngRate));
	} catch (error) {
		next(error);
	}
};

/**
 * GET /api/v1/dashboard/pareto
 * Pareto defect dikelompokkan per 4 slot waktu.
 */
export const getPareto = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const top_n = req.query.top_n ? parseInt(req.query.top_n as string, 10) : 5;
		const result = await dashboardService.getPareto({
			startDate: req.query.startDate as string,
			endDate: req.query.endDate as string,
			tipe_proses: req.query.tipe_proses as string,
			top_n,
		});
		res.json(successResponse(result));
	} catch (error) {
		next(error);
	}
};

/**
 * GET /api/v1/dashboard/trends
 * Tren rasio NG per hari dan per slot waktu.
 */
export const getTrends = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const result = await dashboardService.getTrends({
			startDate: req.query.startDate as string,
			endDate: req.query.endDate as string,
			tipe_proses: req.query.tipe_proses as string,
		});
		res.json(successResponse(result));
	} catch (error) {
		next(error);
	}
};
