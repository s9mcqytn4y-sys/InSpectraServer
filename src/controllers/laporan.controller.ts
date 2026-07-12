import type { NextFunction, Request, Response } from "express";
import * as exportService from "../services/export.service";
import * as laporanService from "../services/laporan.service";
import * as pdfService from "../services/pdf.service";
import { successResponse } from "../utils/ApiResponse";

export const submitLaporanHarian = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const laporan = await laporanService.submitLaporanHarian(req.body);
		res.status(201).json(successResponse(laporan));
	} catch (error) {
		next(error);
	}
};

export const getLaporan = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const page = req.query.page
			? parseInt(req.query.page as string, 10)
			: undefined;
		const limit = req.query.limit
			? parseInt(req.query.limit as string, 10)
			: undefined;
		const search = req.query.search as string | undefined;
		const startDate = req.query.startDate
			? new Date(req.query.startDate as string)
			: undefined;
		const endDate = req.query.endDate
			? new Date(req.query.endDate as string)
			: undefined;
		const exportPdf = req.query.exportPdf === "true";

		// If exporting PDF, we might want to ignore pagination to export all matching data
		const result = await laporanService.getLaporan({
			page: exportPdf ? 1 : page,
			limit: exportPdf ? 10000 : limit,
			search,
			startDate,
			endDate,
		});

		if (exportPdf) {
			let dateRangeStr = "Semua Waktu";
			if (startDate && endDate) {
				dateRangeStr = `${startDate.toLocaleDateString("id-ID")} - ${endDate.toLocaleDateString("id-ID")}`;
			} else if (startDate) {
				dateRangeStr = `Mulai ${startDate.toLocaleDateString("id-ID")}`;
			} else if (endDate) {
				dateRangeStr = `Hingga ${endDate.toLocaleDateString("id-ID")}`;
			}

			const pdfBuffer = await pdfService.generateLaporanProduksiPdf(
				result.data,
				dateRangeStr,
				search || "Semua",
			);

			res.setHeader("Content-Type", "application/pdf");
			res.setHeader(
				"Content-Disposition",
				`attachment; filename="Laporan_Produksi.pdf"`,
			);
			return res.send(pdfBuffer);
		}

		res.json(
			successResponse(result.data, {
				count: result.data.length,
				pagination: {
					total: result.total,
					page: result.page,
					limit: result.limit,
					totalPages: result.totalPages,
				},
			}),
		);
	} catch (error) {
		next(error);
	}
};

export const exportLaporan = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const startDate = req.query.startDate
			? new Date(req.query.startDate as string)
			: undefined;
		const endDate = req.query.endDate
			? new Date(req.query.endDate as string)
			: undefined;

		const buffer = await exportService.exportLaporanToExcel(startDate, endDate);

		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		);
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=laporan-produksi.xlsx",
		);

		res.send(buffer);
	} catch (error) {
		next(error);
	}
};
