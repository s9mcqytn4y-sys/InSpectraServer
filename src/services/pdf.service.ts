const pdfmake = require("pdfmake");

import fs from "node:fs";
import path from "node:path";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

// Define fonts for pdfmake
const fonts = {
	Roboto: {
		normal: "Helvetica",
		bold: "Helvetica-Bold",
		italics: "Helvetica-Oblique",
		bolditalics: "Helvetica-BoldOblique",
	},
};

pdfmake.setFonts(fonts);

export const generateAttendancePdf = async (
	reportData: any[],
	dateRangeStr: string,
	lineProcess: string,
): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		try {
			const docDefinition: TDocumentDefinitions = {
				pageSize: "A4",
				pageOrientation: "landscape",
				pageMargins: [40, 60, 40, 60],
				header: {
					text: "PT. Primaraya Graha Nusantara",
					margin: [40, 20, 0, 0],
					fontSize: 10,
					color: "gray",
				},
				footer: (currentPage, pageCount) => {
					return {
						text: `Halaman ${currentPage} dari ${pageCount}`,
						alignment: "center",
						fontSize: 9,
						margin: [0, 20, 0, 0],
					};
				},
				content: [
					{ text: "Laporan Kehadiran Karyawan", style: "header" },
					{
						text: `Tanggal/Periode: ${dateRangeStr} | Line Proses: ${lineProcess || "Semua"}`,
						style: "subheader",
						margin: [0, 0, 0, 20],
					},
					{
						table: {
							headerRows: 1,
							widths: [
								"auto",
								"auto",
								"*",
								"auto",
								"auto",
								"auto",
								"auto",
								"auto",
							],
							body: [
								[
									{ text: "No", style: "tableHeader" },
									{ text: "Tanggal", style: "tableHeader" },
									{ text: "Nama Karyawan", style: "tableHeader" },
									{ text: "No Reg", style: "tableHeader" },
									{ text: "Keterangan", style: "tableHeader" },
									{ text: "Lembur (Jam)", style: "tableHeader" },
									{ text: "Lembur Non Main Job", style: "tableHeader" },
									{ text: "PIC", style: "tableHeader" },
								],
								...reportData.map((row, index) => [
									index + 1,
									new Date(row.tanggal).toLocaleDateString("id-ID"),
									row.m_karyawan?.nama_lengkap || "-",
									row.m_karyawan?.no_reg || "-",
									row.keterangan,
									row.jam_lembur_aktual?.toString() || "0",
									row.lembur_non_main_job?.replace(/_/g, " ") || "-",
									row.pic_name || "-",
								]),
							],
						},
						layout: "lightHorizontalLines",
					},
				],
				styles: {
					header: {
						fontSize: 18,
						bold: true,
					},
					subheader: {
						fontSize: 12,
						bold: false,
					},
					tableHeader: {
						bold: true,
						fontSize: 11,
						color: "black",
						fillColor: "#f3f4f6",
					},
				},
				defaultStyle: {
					font: "Roboto",
					fontSize: 10,
				},
			};

			const pdfDoc = pdfmake.createPdf(docDefinition);
			pdfDoc
				.getBuffer()
				.then((buffer: Buffer) => {
					resolve(buffer);
				})
				.catch((err: any) => reject(err));

			pdfDoc.end();
		} catch (error) {
			reject(error);
		}
	});
};

export const generateLaporanProduksiPdf = async (
	reportData: any[],
	dateRangeStr: string,
	tipeProses: string,
): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		try {
			const docDefinition: TDocumentDefinitions = {
				pageSize: "A4",
				pageOrientation: "landscape",
				pageMargins: [40, 60, 40, 60],
				header: {
					text: "PT. Primaraya Graha Nusantara",
					margin: [40, 20, 0, 0],
					fontSize: 10,
					color: "gray",
				},
				footer: (currentPage, pageCount) => {
					return {
						text: `Halaman ${currentPage} dari ${pageCount}`,
						alignment: "center",
						fontSize: 9,
						margin: [0, 20, 0, 0],
					};
				},
				content: [
					{ text: "Laporan Produksi", style: "header" },
					{
						text: `Tanggal/Periode: ${dateRangeStr} | Tipe Proses: ${tipeProses || "Semua"}`,
						style: "subheader",
						margin: [0, 0, 0, 20],
					},
					{
						table: {
							headerRows: 1,
							widths: [
								"auto",
								"auto",
								"auto",
								"*",
								"auto",
								"auto",
								"auto",
								"auto",
								"auto",
							],
							body: [
								[
									{ text: "No", style: "tableHeader" },
									{ text: "Tanggal", style: "tableHeader" },
									{ text: "Tipe Proses", style: "tableHeader" },
									{ text: "Part Name", style: "tableHeader" },
									{ text: "Planning", style: "tableHeader" },
									{ text: "Actual", style: "tableHeader" },
									{ text: "NG", style: "tableHeader" },
									{ text: "MP Direct", style: "tableHeader" },
									{ text: "OT Prod", style: "tableHeader" },
								],
								...reportData.flatMap((laporan, index) => {
									if (
										laporan.e_laporan_produksi_detail &&
										laporan.e_laporan_produksi_detail.length > 0
									) {
										return laporan.e_laporan_produksi_detail.map(
											(detail: any, dIndex: number) => [
												dIndex === 0 ? index + 1 : "",
												dIndex === 0
													? new Date(laporan.tanggal).toLocaleDateString(
															"id-ID",
														)
													: "",
												dIndex === 0 ? laporan.tipe_proses : "",
												detail.m_part?.name || "-",
												detail.planning?.toString() || "0",
												detail.actual?.toString() || "0",
												detail.ng?.toString() || "0",
												dIndex === 0
													? laporan.mp_direct?.toString() || "0"
													: "",
												dIndex === 0 ? laporan.ot_prod?.toString() || "0" : "",
											],
										);
									} else {
										return [
											[
												index + 1,
												new Date(laporan.tanggal).toLocaleDateString("id-ID"),
												laporan.tipe_proses,
												"-",
												"-",
												"-",
												"-",
												laporan.mp_direct?.toString() || "0",
												laporan.ot_prod?.toString() || "0",
											],
										];
									}
								}),
							],
						},
						layout: "lightHorizontalLines",
					},
				],
				styles: {
					header: { fontSize: 18, bold: true },
					subheader: { fontSize: 12, bold: false },
					tableHeader: {
						bold: true,
						fontSize: 11,
						color: "black",
						fillColor: "#f3f4f6",
					},
				},
				defaultStyle: { font: "Roboto", fontSize: 10 },
			};
			const pdfDoc = pdfmake.createPdf(docDefinition);
			pdfDoc
				.getBuffer()
				.then((buffer: Buffer) => {
					resolve(buffer);
				})
				.catch((err: any) => reject(err));
		} catch (error) {
			reject(error);
		}
	});
};

export const generateChecksheetPdf = async (
	reportData: any[],
	dateRangeStr: string,
	tipeProses: string,
): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		try {
			const docDefinition: TDocumentDefinitions = {
				pageSize: "A4",
				pageOrientation: "landscape",
				pageMargins: [40, 60, 40, 60],
				header: {
					text: "PT. Primaraya Graha Nusantara",
					margin: [40, 20, 0, 0],
					fontSize: 10,
					color: "gray",
				},
				footer: (currentPage, pageCount) => ({
					text: `Halaman ${currentPage} dari ${pageCount}`,
					alignment: "center",
					fontSize: 9,
					margin: [0, 20, 0, 0],
				}),
				content: [
					{ text: "Laporan E-Checksheet", style: "header" },
					{
						text: `Tanggal/Periode: ${dateRangeStr} | Tipe Proses: ${tipeProses || "Semua"}`,
						style: "subheader",
						margin: [0, 0, 0, 20],
					},
					{
						table: {
							headerRows: 1,
							widths: [
								"auto",
								"auto",
								"auto",
								"auto",
								"auto",
								"auto",
								"auto",
								"auto",
							],
							body: [
								[
									{ text: "No", style: "tableHeader" },
									{ text: "Tanggal", style: "tableHeader" },
									{ text: "Tipe Proses", style: "tableHeader" },
									{ text: "Shift", style: "tableHeader" },
									{ text: "Operator", style: "tableHeader" },
									{ text: "Total Check", style: "tableHeader" },
									{ text: "Total OK", style: "tableHeader" },
									{ text: "Total NG", style: "tableHeader" },
								],
								...reportData.map((row, index) => [
									index + 1,
									new Date(row.tanggal_pemeriksaan).toLocaleDateString("id-ID"),
									row.tipe_proses,
									row.nama_shift || "-",
									row.nama_operator || "-",
									row.total_diperiksa?.toString() || "0",
									row.totalOk?.toString() || "0",
									row.totalNg?.toString() || "0",
								]),
							],
						},
						layout: "lightHorizontalLines",
					},
				],
				styles: {
					header: { fontSize: 18, bold: true },
					subheader: { fontSize: 12, bold: false },
					tableHeader: {
						bold: true,
						fontSize: 11,
						color: "black",
						fillColor: "#f3f4f6",
					},
				},
				defaultStyle: { font: "Roboto", fontSize: 10 },
			};
			const pdfDoc = pdfmake.createPdf(docDefinition);
			pdfDoc
				.getBuffer()
				.then((buffer: Buffer) => {
					resolve(buffer);
				})
				.catch((err: any) => reject(err));
		} catch (error) {
			reject(error);
		}
	});
};

export const generateParetoPdf = async (
	paretoData: any[],
	dateRangeStr: string,
	tipeProses: string,
): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		try {
			const docDefinition: TDocumentDefinitions = {
				pageSize: "A4",
				pageOrientation: "landscape",
				pageMargins: [40, 60, 40, 60],
				header: {
					text: "PT. Primaraya Graha Nusantara",
					margin: [40, 20, 0, 0],
					fontSize: 10,
					color: "gray",
				},
				footer: (currentPage, pageCount) => ({
					text: `Halaman ${currentPage} dari ${pageCount}`,
					alignment: "center",
					fontSize: 9,
					margin: [0, 20, 0, 0],
				}),
				content: [
					{ text: "Laporan Pareto Defect", style: "header" },
					{
						text: `Tanggal/Periode: ${dateRangeStr} | Tipe Proses: ${tipeProses || "Semua"}`,
						style: "subheader",
						margin: [0, 0, 0, 20],
					},
					{
						table: {
							headerRows: 1,
							widths: ["auto", "*", "auto", "auto"],
							body: [
								[
									{ text: "No", style: "tableHeader" },
									{ text: "Nama Defect", style: "tableHeader" },
									{ text: "Total NG", style: "tableHeader" },
									{ text: "Persentase (%)", style: "tableHeader" },
								],
								...paretoData.map((row, index) => [
									index + 1,
									row.nama_defect || "-",
									row.total?.toString() || "0",
									row.persentase?.toString() || "0",
								]),
							],
						},
						layout: "lightHorizontalLines",
					},
				],
				styles: {
					header: { fontSize: 18, bold: true },
					subheader: { fontSize: 12, bold: false },
					tableHeader: {
						bold: true,
						fontSize: 11,
						color: "black",
						fillColor: "#f3f4f6",
					},
				},
				defaultStyle: { font: "Roboto", fontSize: 10 },
			};
			const pdfDoc = pdfmake.createPdf(docDefinition);
			pdfDoc
				.getBuffer()
				.then((buffer: Buffer) => {
					resolve(buffer);
				})
				.catch((err: any) => reject(err));
		} catch (error) {
			reject(error);
		}
	});
};
