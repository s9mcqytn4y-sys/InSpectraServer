import type { NextFunction, Request, Response } from "express";
import * as masterDataService from "../services/masterdata.service";
import { successResponse } from "../utils/ApiResponse";

export const getParts = async (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const parts = await masterDataService.getParts();
		res.json(successResponse(parts, { count: parts.length }));
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
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const materials = await masterDataService.getMaterials();
		res.json(successResponse(materials, { count: materials.length }));
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
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const defects = await masterDataService.getDefects();
		res.json(successResponse(defects, { count: defects.length }));
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
