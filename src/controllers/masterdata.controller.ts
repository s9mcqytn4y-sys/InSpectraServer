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
		const commodity = req.query.commodity as string | undefined;
		const last_sync_time = req.query.last_sync_time as string | undefined;

		const result = await masterDataService.getParts({
			page,
			limit,
			search,
			commodity,
			last_sync_time,
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

export const updatePart = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const part = await masterDataService.updatePart(
			req.params.uniqNo as string,
			req.body,
		);
		res.status(200).json(successResponse(part));
	} catch (error) {
		next(error);
	}
};

export const deletePart = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const part = await masterDataService.deletePart(
			req.params.uniqNo as string,
		);
		res.status(200).json(successResponse(part));
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
		const last_sync_time = req.query.last_sync_time as string | undefined;

		const result = await masterDataService.getMaterials({
			page,
			limit,
			search,
			last_sync_time,
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

export const updateMaterial = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const material = await masterDataService.updateMaterial(
			req.params.code as string,
			req.body,
		);
		res.status(200).json(successResponse(material));
	} catch (error) {
		next(error);
	}
};

export const deleteMaterial = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const material = await masterDataService.deleteMaterial(
			req.params.code as string,
		);
		res.status(200).json(successResponse(material));
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
		const last_sync_time = req.query.last_sync_time as string | undefined;

		const result = await masterDataService.getDefects({
			page,
			limit,
			search,
			last_sync_time,
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

export const updateDefect = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const defect = await masterDataService.updateDefect(
			req.params.id_defect as string,
			req.body,
		);
		res.status(200).json(successResponse(defect));
	} catch (error) {
		next(error);
	}
};

export const deleteDefect = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const defect = await masterDataService.deleteDefect(
			req.params.id_defect as string,
		);
		res.status(200).json(successResponse(defect));
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
