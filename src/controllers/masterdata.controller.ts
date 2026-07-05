import type { NextFunction, Request, Response } from "express";
import * as masterDataService from "../services/masterdata.service";
import { successResponse } from "../utils/ApiResponse";

export const getParts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const parts = await masterDataService.getParts();
		res.json(successResponse(parts));
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
		const materials = await masterDataService.getMaterials();
		res.json(successResponse(materials));
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

export const uploadImage = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.file) {
			return res.status(400).json({ status: "fail", message: "No file uploaded" });
		}
		const fileUrl = `/public/uploads/${req.file.filename}`;
		res.status(201).json(successResponse({ url: fileUrl }));
	} catch (error) {
		next(error);
	}
};
