import type { NextFunction, Request, Response } from "express";
import * as laporanService from "../services/laporan.service";
import { successResponse } from "../utils/ApiResponse";

export const createLaporan = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const laporan = await laporanService.createLaporan(req.body);
		res.status(201).json(successResponse(laporan));
	} catch (error) {
		next(error);
	}
};

export const getLaporan = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const laporanList = await laporanService.getLaporan();
		res.json(successResponse(laporanList));
	} catch (error) {
		next(error);
	}
};
