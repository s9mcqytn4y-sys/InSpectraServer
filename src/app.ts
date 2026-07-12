import path from "node:path";
import cors from "cors";
import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { setupSwagger } from "./config/swagger";
import { env } from "./env";
import { errorResponse } from "./utils/ApiResponse";
import { logger } from "./utils/logger";

const app = express();
const _PORT = env.PORT;

// Security Middlewares
app.use(helmet());
app.use(cors());

import pinoHttp from "pino-http";

// Parse JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(pinoHttp({ logger }));

// Serve static files for uploads
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));
app.use("/public", express.static(path.join(process.cwd(), "public")));

// Setup Swagger UI
setupSwagger(app);

// Rate Limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		status: "fail",
		metadata: { timestamp: new Date().toISOString() },
		message:
			"Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit",
	},
});

const batchLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // Limit each IP to 1000 requests for batch
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		status: "fail",
		metadata: { timestamp: new Date().toISOString() },
		message:
			"Terlalu banyak permintaan batch dari IP ini, silakan coba lagi setelah 15 menit",
	},
});

app.use("/api/v1/checksheet/submit-batch", batchLimiter);
app.use(limiter);

// Removed duplicate express.json and pinoHttp
// Health check endpoint
app.get("/api/v1/health", (_req: Request, res: Response) => {
	res.json({
		status: "success",
		metadata: { timestamp: new Date().toISOString() },
		data: { service: "InSpectraServer", status: "UP" },
	});
});

import { globalErrorHandler } from "./middlewares/error.middleware";
import attendanceRoutes from "./routes/attendance.routes";
import checksheetRoutes from "./routes/checksheet.routes";
import cuttingRoutes from "./routes/cutting.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import laporanRoutes from "./routes/laporan.routes";
import masterDataRoutes from "./routes/masterdata.routes";
import uploadRoutes from "./routes/upload.routes";

// Import Routes
app.use("/api/v1/masterdata", masterDataRoutes);
app.use("/api/v1/checksheet", checksheetRoutes);
app.use("/api/v1/cutting", cuttingRoutes);
app.use("/api/v1/laporan", laporanRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/upload", uploadRoutes);

// 404 Handler
app.use((_req: Request, res: Response) => {
	res.status(404).json(errorResponse("Route not found"));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
