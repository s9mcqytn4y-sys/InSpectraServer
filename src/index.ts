import app from "./app";
import { env } from "./env";
import { logger } from "./utils/logger";
import prisma, { pool } from "./config/prisma";

const PORT = env.PORT;

const server = app.listen(PORT, () => {
	logger.info(
		`[server]: InSpectraServer is running at http://localhost:${PORT}`,
	);
});

const gracefulShutdown = async (signal: string) => {
	logger.info(`Received ${signal}, starting graceful shutdown...`);

	server.close(async () => {
		logger.info("HTTP server closed.");
		try {
			await prisma.$disconnect();
			logger.info("Prisma disconnected.");
			await pool.end();
			logger.info("Postgres pool closed.");
			process.exit(0);
		} catch (err) {
			logger.error(err, "Error during graceful shutdown");
			process.exit(1);
		}
	});
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
