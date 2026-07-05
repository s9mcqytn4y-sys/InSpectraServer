import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodSchema } from "zod";
import { errorResponse } from "../utils/ApiResponse";

export const validate = (schema: ZodSchema) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errors = (error as any).errors.map((e: any) => ({
					path: e.path.join("."),
					message: e.message,
				}));
				res.status(400).json({ ...errorResponse("Validation Error"), errors });
			} else {
				next(error);
			}
		}
	};
};
