import type { tipe_proses_inspectra } from "@prisma/client";
import prisma from "../config/prisma";

export const getTopDefects = async (filters: {
	startDate?: string;
	endDate?: string;
}) => {
	const whereClause: any = {};

	if (filters.startDate || filters.endDate) {
		whereClause.dibuat_pada = {};
		if (filters.startDate)
			whereClause.dibuat_pada.gte = new Date(filters.startDate);
		if (filters.endDate)
			whereClause.dibuat_pada.lte = new Date(filters.endDate);
	}

	const topDefects = await prisma.e_defect_checksheet.groupBy({
		by: ["nama_defect_snapshot"],
		_sum: {
			jumlah: true,
		},
		where: whereClause,
		orderBy: {
			_sum: {
				jumlah: "desc",
			},
		},
		take: 5,
	});

	return topDefects.map((d) => ({
		defect: d.nama_defect_snapshot,
		jumlah: d._sum.jumlah || 0,
	}));
};

export const getOeeMetrics = async (filters: {
	startDate?: string;
	endDate?: string;
	tipe_proses?: tipe_proses_inspectra;
}) => {
	const whereClause: any = {};

	if (filters.startDate || filters.endDate) {
		whereClause.tanggal = {};
		if (filters.startDate)
			whereClause.tanggal.gte = new Date(filters.startDate);
		if (filters.endDate) whereClause.tanggal.lte = new Date(filters.endDate);
	}

	if (filters.tipe_proses) {
		whereClause.tipe_proses = filters.tipe_proses;
	}

	// Calculate Planning, Actual, NG totals
	const details = await prisma.e_laporan_produksi_detail.aggregate({
		_sum: {
			planning: true,
			actual: true,
			ng: true,
		},
		where: {
			e_laporan_produksi: whereClause,
		},
	});

	const planning = details._sum?.planning || 0;
	const actual = details._sum?.actual || 0;
	const ng = details._sum?.ng || 0;

	// OEE Calculation Formulas
	// Availability = (Operating Time / Planned Production Time) -> Simplified: Actual / Planning (Proxy if time not available)
	// Performance = (Total Pieces / Operating Time) -> Simplified: Actual / Planning
	// Quality = (Good Pieces / Total Pieces) -> (Actual - NG) / Actual
	const availability = planning > 0 ? actual / planning : 0;
	const performance = planning > 0 ? actual / planning : 0;
	const goodPieces = actual - ng;
	const quality = actual > 0 ? goodPieces / actual : 0;

	const oee = availability * performance * quality;

	return {
		planning,
		actual,
		ng,
		goodPieces,
		availability: (availability * 100).toFixed(2),
		performance: (performance * 100).toFixed(2),
		quality: (quality * 100).toFixed(2),
		oee: (oee * 100).toFixed(2),
	};
};

export const getNgRate = async (filters: {
	startDate?: string;
	endDate?: string;
	tipe_proses?: string;
}) => {
	const whereClause: any = {};

	if (filters.startDate || filters.endDate) {
		whereClause.tanggal_pemeriksaan = {};
		if (filters.startDate)
			whereClause.tanggal_pemeriksaan.gte = new Date(filters.startDate);
		if (filters.endDate)
			whereClause.tanggal_pemeriksaan.lte = new Date(filters.endDate);
	}

	if (filters.tipe_proses) {
		whereClause.tipe_proses = filters.tipe_proses;
	}

	const sessions = await prisma.checksheetSession.aggregate({
		_sum: {
			totalOk: true,
			totalNg: true,
		},
		where: whereClause,
	});

	const totalOk = sessions._sum?.totalOk || 0;
	const totalNg = sessions._sum?.totalNg || 0;
	const totalDiperiksa = totalOk + totalNg;

	const ngRate = totalDiperiksa > 0 ? (totalNg / totalDiperiksa) * 100 : 0;

	return {
		total_diperiksa: totalDiperiksa,
		total_ok: totalOk,
		total_ng: totalNg,
		ng_rate: ngRate.toFixed(2),
	};
};
