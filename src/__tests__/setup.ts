import { afterAll, beforeAll } from "vitest";
import prisma from "../config/prisma";

beforeAll(async () => {
	// Any global setup before all tests
});

afterAll(async () => {
	await prisma.$disconnect();
});
