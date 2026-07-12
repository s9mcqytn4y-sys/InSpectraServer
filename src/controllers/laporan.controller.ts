import type { NextFunction, Request, Response } from "express";
import * as exportService from "../services/export.service";
import * as laporanService from "../services/laporan.service";
import { successResponse } from "../utils/ApiResponse";

export const submitLaporanHarian = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const laporan = await laporanService.submitLaporanHarian(req.body);
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
		const page = req.query.page
			? parseInt(req.query.page as string, 10)
			: undefined;
		const limit = req.query.limit
			? parseInt(req.query.limit as string, 10)
			: undefined;
		const search = req.query.search as string | undefined;
		const startDate = req.query.startDate
			? new Date(req.query.startDate as string)
			: undefined;
		const endDate = req.query.endDate
			? new Date(req.query.endDate as string)
			: undefined;

		const result = await laporanService.getLaporan({
			page,
			limit,
			search,
			startDate,
			endDate,
		});
		res.json(
			successResponse(result.data, {
				count: result.data.length,
				pagination: {
					total: result.total,
					page: result.page,
					limit: result.limit,
					totalPages: result.totalPages,
				},
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const exportLaporan = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const startDate = req.query.startDate
			? new Date(req.query.startDate as string)
			: undefined;
		const endDate = req.query.endDate
			? new Date(req.query.endDate as string)
			: undefined;

		const buffer = await exportService.exportLaporanToExcel(startDate, endDate);

		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		);
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=laporan-produksi.xlsx",
		);

		res.send(buffer);
	} catch (error) {
		next(error);
	}
};
