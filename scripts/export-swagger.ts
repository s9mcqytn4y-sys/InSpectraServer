import fs from "node:fs";
import path from "node:path";
import swaggerJsdoc from "swagger-jsdoc";
import { env } from "../src/env";

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "InSpectraServer API",
			version: "1.0.0",
			description: "API Documentation for InSpectra Quality Control",
		},
		servers: [
			{
				url: `http://localhost:${env.PORT}`,
				description: "Development Server",
			},
		],
	},
	apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/dtos/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

const outputDir = path.join(process.cwd(), "docs");
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

// Postman can seamlessly import OpenAPI v3 format
const outputPath = path.join(outputDir, "postman_collection.json");
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log(`Successfully generated Postman Collection at ${outputPath}`);
