import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { errorResponse } from "../utils/ApiResponse";
import { logger } from "../utils/logger";

export const globalErrorHandler = (
	err: any,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	logger.error(err);

	// 1. Handle Zod Validation Errors
	if (err instanceof ZodError) {
		const details = err.issues.map((e) => ({
			path: e.path.join("."),
			message: e.message,
		}));

		return res.status(400).json({
			status: "error",
			message: "Validasi data gagal",
			errors: details,
		});
	}

	// 2. Handle Prisma Known Errors
	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		// Unique constraint violation
		if (err.code === "P2002") {
			const target = (err.meta?.target as string[]) || [];
			return res
				.status(409)
				.json(errorResponse(`Data duplikat pada field: ${target.join(", ")}`));
		}

		// Foreign key constraint failure
		if (err.code === "P2003") {
			return res
				.status(400)
				.json(
					errorResponse(
						"Gagal memproses data karena relasi antar tabel tidak valid (Foreign Key Error)",
					),
				);
		}

		// Record not found
		if (err.code === "P2025") {
			return res
				.status(404)
				.json(errorResponse(err.message || "Data tidak ditemukan"));
		}
	}

	// 3. Fallback to Internal Server Error
	const message = err.message || "Terjadi kesalahan internal pada server";
	res.status(500).json(errorResponse(message));
};
