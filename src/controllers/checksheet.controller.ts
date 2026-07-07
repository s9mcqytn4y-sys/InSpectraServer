import type { NextFunction, Request, Response } from "express";
import * as checksheetService from "../services/checksheet.service";
import { successResponse } from "../utils/ApiResponse";

export const startSession = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const session = await checksheetService.startSession(req.body);
		res.status(201).json(successResponse(session));
	} catch (error) {
		next(error);
	}
};

export const submitItemCheck = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const item = await checksheetService.submitItemCheck(req.body);
		res.status(201).json(successResponse(item));
	} catch (error) {
		next(error);
	}
};

export const submitDefect = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const session = await checksheetService.submitDefect(req.body);
		res.json(successResponse(session));
	} catch (error) {
		next(error);
	}
};

export const getSessions = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
		const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
		const tipe_proses = req.query.tipe_proses as string | undefined;
		const tanggal = req.query.tanggal as string | undefined;

		const result = await checksheetService.getSessions({ page, limit, tipe_proses, tanggal });
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

/**
 * POST /api/v1/checksheet/submit-batch
 * Mengirim seluruh data sesi, item, defect, dan alokasi slot dalam satu transaksi.
 */
export const submitBatch = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const result = await checksheetService.submitBatch(req.body);
		res.status(201).json(successResponse(result));
	} catch (error) {
		next(error);
	}
};

/**
 * GET /api/v1/checksheet/slots
 * Mendapatkan daftar slot waktu yang tersedia berdasarkan tipe proses.
 */
export const getSlotWaktu = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const tipe_proses = req.query.tipe_proses as string | undefined;
		const slots = await checksheetService.getSlotWaktu(tipe_proses);
		res.json(successResponse(slots, { count: slots.length }));
	} catch (error) {
		next(error);
	}
};
