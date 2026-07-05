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
