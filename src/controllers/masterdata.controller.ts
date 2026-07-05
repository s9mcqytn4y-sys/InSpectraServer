import type { NextFunction, Request, Response } from "express";
import * as masterDataService from "../services/masterdata.service";
import { successResponse } from "../utils/ApiResponse";

export const getParts = async (
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

		const result = await masterDataService.getParts({ page, limit, search });
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

export const createPart = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const part = await masterDataService.createPart(req.body);
		res.status(201).json(successResponse(part));
	} catch (error) {
		next(error);
	}
};

export const getMaterials = async (
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

		const result = await masterDataService.getMaterials({
			page,
			limit,
			search,
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

export const createMaterial = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const material = await masterDataService.createMaterial(req.body);
		res.status(201).json(successResponse(material));
	} catch (error) {
		next(error);
	}
};

export const getDefects = async (
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

		const result = await masterDataService.getDefects({ page, limit, search });
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

export const createDefect = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const defect = await masterDataService.createDefect(req.body);
		res.status(201).json(successResponse(defect));
	} catch (error) {
		next(error);
	}
};

export const uploadImage = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.file) {
			return res
				.status(400)
				.json({ status: "fail", message: "File gambar tidak ditemukan" });
		}
		const fileUrl = `/public/uploads/${req.file.filename}`;
		res.status(201).json(successResponse({ url: fileUrl }));
	} catch (error) {
		next(error);
	}
};
