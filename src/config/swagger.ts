import type { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { env } from "../env";

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "InSpectraServer API",
			version: "1.0.0",
			description: "API Documentation for InSpectra Quality Control",
			contact: {
				name: "Developer",
				email: "developer@inspectra.local",
			},
		},
		servers: [
			{
				url: `http://localhost:${env.PORT}`,
				description: "Development Server",
			},
		],
		components: {
			securitySchemes: {
				BearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [
			{
				BearerAuth: [],
			},
		],
	},
	// Look for swagger docs in these files
	apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/dtos/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
	app.use(
		"/api-docs",
		swaggerUi.serve,
		swaggerUi.setup(swaggerSpec, {
			customSiteTitle: "InSpectra API Docs",
			customCss: ".swagger-ui .topbar { display: none }",
		}),
	);
};
