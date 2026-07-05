import type { NextFunction, Request, Response } from "express";
import * as attendanceService from "../services/attendance.service";
import { successResponse } from "../utils/ApiResponse";

export const createEmployee = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const employee = await attendanceService.createEmployee(req.body);
		res.status(201).json(successResponse(employee));
	} catch (error) {
		next(error);
	}
};

export const getEmployees = async (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const employees = await attendanceService.getEmployees();
		res.json(successResponse(employees));
	} catch (error) {
		next(error);
	}
};
