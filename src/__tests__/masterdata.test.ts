import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app";
import prisma from "../config/prisma";

describe("Master Data API Endpoints", () => {
	describe("GET /api/v1/masterdata/parts", () => {
		it("should return a list of parts", async () => {
			const res = await request(app).get("/api/v1/masterdata/parts");
			expect(res.status).toBe(200);
			expect(res.body.status).toBe("success");
			expect(Array.isArray(res.body.data)).toBe(true);
		});

		it("should handle last_sync_time parameter for delta sync", async () => {
			const res = await request(app).get("/api/v1/masterdata/parts?last_sync_time=2024-01-01T00:00:00.000Z");
			expect(res.status).toBe(200);
			expect(res.body.status).toBe("success");
			expect(Array.isArray(res.body.data)).toBe(true);
		});
	});

	describe("GET /api/v1/masterdata/materials", () => {
		it("should return a list of materials", async () => {
			const res = await request(app).get("/api/v1/masterdata/materials");
			expect(res.status).toBe(200);
			expect(res.body.status).toBe("success");
			expect(Array.isArray(res.body.data)).toBe(true);
		});
	});

	describe("GET /api/v1/masterdata/defects", () => {
		it("should return a list of defects", async () => {
			const res = await request(app).get("/api/v1/masterdata/defects");
			expect(res.status).toBe(200);
			expect(res.body.status).toBe("success");
			expect(Array.isArray(res.body.data)).toBe(true);
		});
	});

	// Note: We don't blindly test create/update/delete in a live database
	// unless we use transactions or mock. For now, testing GET is safe.
});
