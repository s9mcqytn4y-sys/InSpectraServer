import prisma from "../config/prisma";

export const createBatch = async (data: {
	id_sesi: string;
	material_id: string;
	no_lot_roll?: string;
	no_roll?: string;
	ukuran_cutting_cm?: number;
	size_cutting_cm?: number;
	qty_layer_ok?: number;
	qty_layer_ng?: number;
	waste_panjang_cm?: number;
	pic?: string;
	catatan?: string;
}) => {
	const qty_ok = data.qty_layer_ok || 0;
	const qty_ng = data.qty_layer_ng || 0;
	const ukuran_cm = data.ukuran_cutting_cm || 0;
	const waste_cm = data.waste_panjang_cm || 0;

	const panjang_ok_cm = qty_ok * ukuran_cm;
	const panjang_ng_cm = qty_ng * ukuran_cm;

	return await prisma.cuttingBatch.create({
		data: {
			id_sesi: data.id_sesi,
			material_id: data.material_id,
			no_lot_roll: data.no_lot_roll,
			no_roll: data.no_roll,
			ukuran_cutting_cm: data.ukuran_cutting_cm,
			size_cutting_cm: data.size_cutting_cm,
			qty_layer_ok: qty_ok,
			qty_layer_ng: qty_ng,
			waste_panjang_cm: waste_cm,
			panjang_ok_cm: panjang_ok_cm,
			panjang_ng_cm: panjang_ng_cm,
			panjang_waste_cm: waste_cm,
			pic: data.pic,
			catatan: data.catatan,
		},
	});
};

export const getBatches = async () => {
	return await prisma.cuttingBatch.findMany({
		orderBy: { dibuat_pada: "desc" },
	});
};
