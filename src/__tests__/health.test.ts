import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app";

describe("Health Check API", () => {
	it("should return 200 and UP status on /api/v1/health", async () => {
		const res = await request(app).get("/api/v1/health");

		expect(res.status).toBe(200);
		expect(res.body.status).toBe("success");
		expect(res.body.data.service).toBe("InSpectraServer");
		expect(res.body.data.status).toBe("UP");
		expect(res.body.metadata.timestamp).toBeDefined();
	});

	it("should return 404 for unknown routes", async () => {
		const res = await request(app).get("/api/v1/unknown-route");

		expect(res.status).toBe(404);
		expect(res.body.status).toBe("error");
		expect(res.body.message).toBe("Route not found");
	});
});
