import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		PORT: z.coerce.number().default(3000),
		DATABASE_URL: z.string().url(),
		JWT_SECRET: z.string().min(1).default("secret-key-development-only"),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
