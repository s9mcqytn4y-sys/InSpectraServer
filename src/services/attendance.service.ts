import type { tipe_proses_inspectra } from "@prisma/client";
import prisma from "../config/prisma";
import { CACHE_KEYS, invalidatePrefix, referenceCache } from "../utils/cache";
import { generateAttendancePdf } from "./pdf.service";

// ==========================================
// KARYAWAN (MASTER DATA)
// ==========================================
export const createEmployee = async (data: {
	nama_lengkap: string;
	tipe_pekerja: any;
	line_process: any;
	no_reg?: string;
}) => {
	const employee = await prisma.masterEmployee.create({
		data: {
			nama_lengkap: data.nama_lengkap,
			tipe_pekerja: data.tipe_pekerja,
			line_process: data.line_process,
			no_reg: data.no_reg,
		},
	});
	invalidatePrefix(CACHE_KEYS.EMPLOYEES);
	return employee;
};

export const getEmployees = async (
	params: { search?: string; limit?: number } = {},
) => {
	const cacheKey = `${CACHE_KEYS.EMPLOYEES}_${params.search || "all"}_${params.limit || 100}`;
	const cached = referenceCache.get<any>(cacheKey);
	if (cached) return cached;

	const employees = await prisma.masterEmployee.findMany({
		where: params.search
			? {
					nama_lengkap: { contains: params.search, mode: "insensitive" },
				}
			: undefined,
		take: params.limit || 100,
		orderBy: { nama_lengkap: "asc" },
	});

	referenceCache.set(cacheKey, employees);
	return employees;
};

// ==========================================
// LAPORAN ABSENSI (REPORTS)
// ==========================================
export const getAttendanceReport = async (params: {
	startDate: string;
	endDate: string;
	lineProcess?: tipe_proses_inspectra;
	search?: string;
	page?: number;
	limit?: number;
	exportPdf?: boolean;
}) => {
	const {
		startDate,
		endDate,
		lineProcess,
		search,
		page = 1,
		limit = 50,
		exportPdf = false,
	} = params;

	const cacheKey = `${CACHE_KEYS.ATTENDANCE_REPORT}_${startDate}_${endDate}_${lineProcess || "all"}_${search || ""}_${page}_${limit}_${exportPdf}`;
	const cached = referenceCache.get<any>(cacheKey);
	if (cached && !exportPdf) return cached; // Don't cache PDF buffers in referenceCache easily without memory limit

	const where: any = {
		tanggal: {
			gte: new Date(startDate),
			lte: new Date(endDate),
		},
	};

	if (lineProcess) {
		where.line_process = lineProcess;
	}

	if (search) {
		where.m_karyawan = {
			nama_lengkap: { contains: search, mode: "insensitive" },
		};
	}

	const skip = (page - 1) * limit;

	// If export PDF, we might want to fetch all or a high limit
	const take = exportPdf ? 10000 : limit;

	const [data, total] = await Promise.all([
		prisma.t_rasio_kehadiran.findMany({
			where,
			include: {
				m_karyawan: {
					select: { nama_lengkap: true, no_reg: true },
				},
			},
			orderBy: [{ tanggal: "desc" }, { line_process: "asc" }],
			skip,
			take,
		}),
		prisma.t_rasio_kehadiran.count({ where }),
	]);

	if (exportPdf) {
		const dateRangeStr = `${startDate} s/d ${endDate}`;
		const pdfBuffer = await generateAttendancePdf(
			data,
			dateRangeStr,
			lineProcess || "Semua",
		);
		return { pdfBuffer };
	}

	const result = {
		data,
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit),
	};

	referenceCache.set(cacheKey, result);
	return result;
};
