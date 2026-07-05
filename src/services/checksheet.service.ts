import prisma from "../config/prisma";

export const startSession = async (data: {
	tipe_proses: any;
	nama_shift: string;
	nama_operator: string;
}) => {
	return await prisma.checksheetSession.create({
		data: {
			tipe_proses: data.tipe_proses,
			nama_shift: data.nama_shift,
			nama_operator: data.nama_operator,
		},
	});
};

export const submitDefect = async (data: {
	sessionId: string;
	defectId: string;
	quantity: number;
}) => {
	return await prisma.$transaction(async (tx) => {
		// Increment total Ng
		const session = await tx.checksheetSession.update({
			where: { id: data.sessionId },
			data: {
				totalNg: { increment: data.quantity },
			},
		});
		return session;
	});
};

export const getSessions = async () => {
	return await prisma.checksheetSession.findMany({
		orderBy: { dibuat_pada: "desc" },
	});
};
