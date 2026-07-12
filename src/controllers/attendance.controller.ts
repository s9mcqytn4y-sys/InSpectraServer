import type { tipe_proses_inspectra } from "@prisma/client";
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
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const search = req.query.search as string | undefined;
		const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
		const employees = await attendanceService.getEmployees({ search, limit });
		res.json(successResponse(employees));
	} catch (error) {
		next(error);
	}
};

export const getAttendanceReport = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const startDate = req.query.startDate as string;
		const endDate = req.query.endDate as string;
		const lineProcess = req.query.lineProcess as
			| tipe_proses_inspectra
			| undefined;
		const search = req.query.search as string | undefined;
		const page = req.query.page ? parseInt(req.query.page as string) : 1;
		const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
		const exportPdf = req.query.exportPdf === "true";

		if (!startDate || !endDate) {
			res.status(400).json({
				success: false,
				message: "startDate dan endDate wajib diisi.",
			});
			return;
		}

		const report = await attendanceService.getAttendanceReport({
			startDate,
			endDate,
			lineProcess,
			search,
			page,
			limit,
			exportPdf,
		});

		if (exportPdf && (report as any).pdfBuffer) {
			res.setHeader("Content-Type", "application/pdf");
			res.setHeader(
				"Content-Disposition",
				`attachment; filename="Laporan_Absensi_${startDate}_${endDate}.pdf"`,
			);
			res.send((report as any).pdfBuffer);
			return;
		}

		res.json(successResponse(report));
	} catch (error) {
		next(error);
	}
};
