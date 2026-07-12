import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app";

describe("Checksheet API Endpoints - E2E", () => {
	describe("POST /api/v1/checksheet/submit-batch", () => {
		it("should return 400 if payload is missing required session fields", async () => {
			const res = await request(app)
				.post("/api/v1/checksheet/submit-batch")
				.send({
					session: {
						// Missing tipe_proses and nama_shift
					},
					items: [
						{
							uniq_no: "PART-001",
							jumlah_diperiksa: 10,
							jumlah_ok: 10,
							jumlah_ng: 0,
						},
					],
				});
			expect(res.status).toBe(400);
			expect(res.body.status).toBe("error");
			expect(res.body.message).toBe("Validation Error");
			expect(res.body.errors.length).toBeGreaterThan(0);
		});

		it("should return 400 if item quantities are invalid", async () => {
			const res = await request(app)
				.post("/api/v1/checksheet/submit-batch")
				.send({
					session: {
						tipe_proses: "PRESS",
						nama_shift: "Shift 1",
					},
					items: [
						{
							uniq_no: "PART-001",
							jumlah_diperiksa: 0, // Invalid: min 1
							jumlah_ok: -5, // Invalid: min 0
							jumlah_ng: -1, // Invalid: min 0
						},
					],
				});
			expect(res.status).toBe(400);
			expect(res.body.status).toBe("error");
			expect(res.body.message).toBe("Validation Error");

			expect(res.body.errors.length).toBeGreaterThan(0);
		});

		it("should return 400 if defect payload is invalid", async () => {
			const res = await request(app)
				.post("/api/v1/checksheet/submit-batch")
				.send({
					session: {
						tipe_proses: "PRESS",
						nama_shift: "Shift 1",
					},
					items: [
						{
							uniq_no: "PART-001",
							jumlah_diperiksa: 10,
							jumlah_ok: 8,
							jumlah_ng: 2,
							defects: [
								{
									// Missing id_defect
									nama_defect_snapshot: "Retak",
									kategori: "Mayor",
									jumlah: 0, // Invalid: min 1
								},
							],
						},
					],
				});
			expect(res.status).toBe(400);
			expect(res.body.status).toBe("error");
			expect(res.body.message).toBe("Validation Error");
			expect(res.body.errors.length).toBeGreaterThan(0);
		});

		it("should attempt to process a valid payload (might return 500/404 if data not seeded, but schema passes)", async () => {
			const validPayload = {
				session: {
					tipe_proses: "PRESS",
					nama_shift: "Shift 1",
					nama_operator: "Budi",
				},
				items: [
					{
						uniq_no: "DUMMY-PART-123",
						jumlah_diperiksa: 100,
						jumlah_ok: 100,
						jumlah_ng: 0,
					},
				],
			};

			const res = await request(app)
				.post("/api/v1/checksheet/submit-batch")
				.send(validPayload);
			
			// It should pass Zod validation, so it won't be 400 from Zod.
			// Depending on DB state, it might succeed (201) or fail (404 part not found).
			// We just verify it doesn't fail schema validation.
			expect(res.status).not.toBe(400);
		});
	});
});
