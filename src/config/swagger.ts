import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";
import { env } from "../env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "InSpectraServer API",
      version: "2.0.0",
      description: "API Documentation for InSpectra Quality Control",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Development Server",
      },
    ],
  },
  // Look for swagger docs in these files
  apis: ["./src/routes/*.ts", "./src/modules/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
