import type { NextFunction, Request, Response } from "express";
import * as cuttingService from "../services/cutting.service";
import { successResponse } from "../utils/ApiResponse";

export const createBatch = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const batch = await cuttingService.createBatch(req.body);
		res.status(201).json(successResponse(batch));
	} catch (error) {
		next(error);
	}
};

export const getBatches = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const batches = await cuttingService.getBatches();
		res.json(successResponse(batches));
	} catch (error) {
		next(error);
	}
};
