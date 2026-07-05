import type { NextFunction, Request, Response } from "express";
import { successResponse } from "../utils/ApiResponse";

export const uploadFile = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.file) {
			res
				.status(400)
				.json({ status: "error", message: "File tidak ditemukan." });
			return;
		}

		// File is uploaded to /public/uploads
		// We return the URL path that can be saved in DB
		const fileUrl = `/uploads/${req.file.filename}`;

		res.json(successResponse({ url: fileUrl }));
	} catch (error) {
		next(error);
	}
};
