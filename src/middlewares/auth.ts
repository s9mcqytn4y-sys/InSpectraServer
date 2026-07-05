import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/ApiResponse";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export const requireAuth = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res
			.status(401)
			.json(errorResponse("Unauthorized: Missing or invalid token"));
	}

	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		(req as any).user = decoded;
		next();
	} catch (error) {
		return res
			.status(401)
			.json(errorResponse("Unauthorized: Invalid or expired token"));
	}
};

export const requireRole = (roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = (req as any).user;
		if (!user || !roles.includes(user.role)) {
			return res
				.status(403)
				.json(errorResponse("Forbidden: Insufficient privileges"));
		}
		next();
	};
};
