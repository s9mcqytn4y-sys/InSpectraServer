import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { swaggerSpec } from "../src/config/swagger";

const outputPath = resolve(__dirname, "../docs/openapi.json");

writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), "utf-8");

console.log(`✅ OpenAPI spec berhasil diekspor ke: ${outputPath}`);
