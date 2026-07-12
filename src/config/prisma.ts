import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { env } from "../env";

const connectionString = env.DATABASE_URL;

export const pool = new Pool({
	connectionString,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 5000,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
	adapter,
	log: ["query", "info", "warn", "error"],
});

export default prisma;
