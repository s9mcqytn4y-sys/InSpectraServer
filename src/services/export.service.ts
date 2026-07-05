import ExcelJS from "exceljs";
import prisma from "../config/prisma";

export const exportLaporanToExcel = async (
	startDate?: Date,
	endDate?: Date,
) => {
	const where: any = {};
	if (startDate || endDate) {
		where.tanggal = {};
		if (startDate) where.tanggal.gte = startDate;
		if (endDate) where.tanggal.lte = endDate;
	}

	const data = await prisma.e_laporan_produksi.findMany({
		where,
		orderBy: { tanggal: "desc" },
		include: { e_laporan_produksi_detail: { include: { m_part: true } } },
	});

	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet("Laporan Produksi");

	sheet.columns = [
		{ header: "Tanggal", key: "tanggal", width: 15 },
		{ header: "Tipe Proses", key: "tipe_proses", width: 15 },
		{ header: "Part Name", key: "part_name", width: 25 },
		{ header: "Planning", key: "planning", width: 10 },
		{ header: "Actual", key: "actual", width: 10 },
		{ header: "NG", key: "ng", width: 10 },
		{ header: "MP Direct", key: "mp_direct", width: 10 },
		{ header: "MP Indirect", key: "mp_indirect", width: 12 },
		{ header: "OT Prod", key: "ot_prod", width: 10 },
	];

	// Add data
	for (const laporan of data) {
		if (laporan.e_laporan_produksi_detail.length > 0) {
			for (const detail of laporan.e_laporan_produksi_detail) {
				sheet.addRow({
					tanggal: laporan.tanggal.toISOString().split("T")[0],
					tipe_proses: laporan.tipe_proses,
					part_name: detail.m_part.name,
					planning: detail.planning,
					actual: detail.actual,
					ng: detail.ng,
					mp_direct: laporan.mp_direct,
					mp_indirect: laporan.mp_indirect,
					ot_prod: laporan.ot_prod,
				});
			}
		} else {
			sheet.addRow({
				tanggal: laporan.tanggal.toISOString().split("T")[0],
				tipe_proses: laporan.tipe_proses,
				mp_direct: laporan.mp_direct,
				mp_indirect: laporan.mp_indirect,
				ot_prod: laporan.ot_prod,
			});
		}
	}

	sheet.getRow(1).font = { bold: true };

	return await workbook.xlsx.writeBuffer();
};
