import { createClient } from "@supabase/supabase-js";
import prisma from "../src/config/prisma";
import "dotenv/config";

// Ensure SUPABASE_URL and SUPABASE_KEY are provided in .env
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
	console.error("Missing SUPABASE_URL or SUPABASE_KEY");
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateParts() {
	console.log("Migrating MasterParts...");
	const { data, error } = await supabase.from("m_part").select("*");
	if (error) {
		console.error("Error fetching m_part:", error);
		return;
	}

	for (const part of data) {
		await prisma.masterPart.upsert({
			where: { uniqNo: part.uniq_no },
			update: {
				name: part.part_name,
				model: part.part_model,
				commodity: part.komoditi,
				pos: part.pos,
			},
			create: {
				uniqNo: part.uniq_no,
				name: part.part_name,
				model: part.part_model,
				commodity: part.komoditi,
				pos: part.pos,
			},
		});
	}
	console.log(`Migrated ${data.length} MasterParts.`);
}

// TODO: Add more migration functions for Users, Checksheets, etc.

async function main() {
	console.log("Starting Migration from Supabase to Local Postgres...");
	await migrateParts();
	console.log("Migration Complete.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
