import prisma from "../config/prisma";

export const createEmployee = async (data: {
	nama_lengkap: string;
	tipe_pekerja: any;
	line_process: any;
	no_reg?: string;
}) => {
	return await prisma.masterEmployee.create({
		data: {
			nama_lengkap: data.nama_lengkap,
			tipe_pekerja: data.tipe_pekerja,
			line_process: data.line_process,
			no_reg: data.no_reg,
		},
	});
};

export const getEmployees = async () => {
	return await prisma.masterEmployee.findMany();
};
