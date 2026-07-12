import prisma from "../src/config/prisma";

const API_URL = "http://localhost:3000/api/v1";

async function runTests() {
	console.log("🚀 Memulai pengujian POST ke semua endpoint...");

	// Ambil referensi dari database
	const material = await prisma.masterMaterial.findFirst();
	const part = await prisma.masterPart.findFirst();
	const defect = await prisma.masterDefect.findFirst();

	if (!material || !part || !defect) {
		console.log(
			"❌ Master data belum lengkap. Harap jalankan seeder terlebih dahulu.",
		);
		process.exit(1);
	}

	let cuttingBatchId: string | null = null;
	let sessionChecksheetId: string | null = null;
	let itemChecksheetId: string | null = null;
	let defectId: string | null = null;
	let laporanId: string | null = null;
	let laporanDetailId: string | null = null;

	try {
		// 2. POST Checksheet Session (Dibutuhkan untuk cutting batch)
		console.log("\n👉 2. POST /checksheet/sessions");
		const resSession = await fetch(`${API_URL}/checksheet/sessions`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				tipe_proses: "SEWING",
				nama_shift: "SHIFT 1",
				nama_operator: "Andi",
			}),
		});
		const dataSession = await resSession.json();
		console.log("✅ Response:", dataSession);
		if (dataSession.status === "success") {
			sessionChecksheetId = dataSession.data.id;
		} else {
			throw new Error(dataSession.message || "Failed Checksheet Session");
		}

		// 1. POST Cutting Batch
		console.log("👉 1. POST /cutting/batches");
		const resCutting = await fetch(`${API_URL}/cutting/batches`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id_sesi: sessionChecksheetId,
				material_id: material.id,
				ukuran_cutting_cm: 50,
				qty_layer_ok: 10,
				qty_layer_ng: 2,
			}),
		});
		const dataCutting = await resCutting.json();
		console.log("✅ Response:", dataCutting);
		if (dataCutting.status === "success") {
			cuttingBatchId = dataCutting.data.id;
		} else {
			throw new Error(dataCutting.message || "Failed Cutting Batch");
		}

		// 3. POST Checksheet Item
		console.log("\n👉 3. POST /checksheet/item");
		const resItem = await fetch(`${API_URL}/checksheet/item`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id_sesi: sessionChecksheetId,
				uniq_no: part.uniqNo,
				jumlah_diperiksa: 10,
				jumlah_ok: 8,
				jumlah_ng: 2,
				catatan: "Ada masalah pada jahitan",
			}),
		});
		const dataItem = await resItem.json();
		console.log("✅ Response:", dataItem);
		if (dataItem.status === "success") {
			itemChecksheetId = dataItem.data.id;
		} else {
			throw new Error(dataItem.message || "Failed Checksheet Item");
		}

		// 4. POST Checksheet Defect
		console.log("\n👉 4. POST /checksheet/defect");
		const resDefect = await fetch(`${API_URL}/checksheet/defect`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id_item: itemChecksheetId,
				id_defect: defect.id_defect,
				nama_defect_snapshot: defect.name,
				kategori: defect.category,
				jumlah: 1,
			}),
		});
		const dataDefect = await resDefect.json();
		console.log("✅ Response:", dataDefect);
		if (dataDefect.status === "success") {
			defectId = dataDefect.data.id;
		} else {
			throw new Error(dataDefect.message || "Failed Checksheet Defect");
		}

		// 5. POST Laporan
		console.log("\n👉 5. POST /laporan");
		const resLaporan = await fetch(`${API_URL}/laporan`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				tanggal: new Date().toISOString(),
				tipe_proses: "SEWING",
				mp_direct: 10,
				mp_indirect: 2,
				jkn_hour: 8,
				jkn_menit: 0,
				ot_prod: 0,
				ot_non: 0,
			}),
		});
		const dataLaporan = await resLaporan.json();
		console.log("✅ Response:", dataLaporan);
		if (dataLaporan.status === "success") {
			laporanId = dataLaporan.data.id;
		} else {
			throw new Error(dataLaporan.message || "Failed Laporan");
		}

		// 5b. GET Laporan (Pagination & Export)
		console.log("\n👉 5b. GET /laporan?page=1&limit=5");
		const resGetLaporan = await fetch(`${API_URL}/laporan?page=1&limit=5`);
		const dataGetLaporan = await resGetLaporan.json();
		console.log("✅ Response:", {
			status: dataGetLaporan.status,
			count: dataGetLaporan.metadata.count,
			pagination: dataGetLaporan.metadata.pagination,
		});

		// 6. POST Laporan Detail
		console.log("\n👉 6. POST /laporan/detail");
		const resDetail = await fetch(`${API_URL}/laporan/detail`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id_laporan: laporanId,
				id_part: part.id,
				planning: 500,
				actual: 450,
				ng: 50,
			}),
		});
		const dataDetail = await resDetail.json();
		console.log("✅ Response:", dataDetail);
		if (dataDetail.status === "success") {
			laporanDetailId = dataDetail.data.id;
		} else {
			throw new Error(dataDetail.message || "Failed Laporan Detail");
		}

		console.log("\n🎉 SEMUA POST BERHASIL DIEKSEKUSI!");
	} catch (error) {
		console.error("❌ ERROR SAAT POST DATA:", error);
	} finally {
		console.log("\n🧹 Memulai proses penghapusan (Cleanup)...");

		// Hapus data secara berurutan sesuai relasinya (child duluan)
		if (laporanDetailId) {
			await prisma.e_laporan_produksi_detail
				.delete({ where: { id: laporanDetailId } })
				.catch(() => {});
			console.log("🗑️ Laporan Detail dihapus.");
		}
		if (laporanId) {
			await prisma.e_laporan_produksi
				.delete({ where: { id: laporanId } })
				.catch(() => {});
			console.log("🗑️ Laporan dihapus.");
		}

		if (defectId) {
			await prisma.e_defect_checksheet
				.delete({ where: { id: defectId } })
				.catch(() => {});
			console.log("🗑️ Checksheet Defect dihapus.");
		}
		if (itemChecksheetId) {
			await prisma.e_item_checksheet
				.delete({ where: { id: itemChecksheetId } })
				.catch(() => {});
			console.log("🗑️ Checksheet Item dihapus.");
		}

		if (cuttingBatchId) {
			await prisma.cuttingBatch
				.delete({ where: { id: cuttingBatchId } })
				.catch(() => {});
			console.log("🗑️ Cutting Batch dihapus.");
		}

		if (sessionChecksheetId) {
			await prisma.checksheetSession
				.delete({ where: { id: sessionChecksheetId } })
				.catch(() => {});
			console.log("🗑️ Checksheet Session dihapus.");
		}

		console.log("✨ Cleanup selesai.");
		await prisma.$disconnect();
	}
}

runTests();
