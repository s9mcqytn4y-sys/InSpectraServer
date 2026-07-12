import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { errorResponse } from "../utils/ApiResponse";

export const validate =
	(schema: any) =>
	(req: Request, res: Response, next: NextFunction): void => {
		try {
			const validatedData = schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			if (validatedData.body) req.body = validatedData.body;
			if (validatedData.params) req.params = validatedData.params;
			if (validatedData.query) {
				Object.defineProperty(req, "query", {
					value: validatedData.query,
					writable: true,
					configurable: true,
					enumerable: true,
				});
			}
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errs = (error as any).errors || (error as any).issues || [];
				const errors = errs.map((e: any) => ({
					path: e.path ? e.path.join(".") : "",
					message: e.message,
				}));
				res
					.status(400)
					.json({ ...errorResponse("Validasi data gagal"), errors });
			} else {
				next(error);
			}
		}
	};
