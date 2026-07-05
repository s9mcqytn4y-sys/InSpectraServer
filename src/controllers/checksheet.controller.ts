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
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const sessions = await checksheetService.getSessions();
		res.json(successResponse(sessions, { count: sessions.length }));
	} catch (error) {
		next(error);
	}
};
