import NodeCache from "node-cache";

// Sesuai AGENTS.md: "Seluruh pengambilan Data Induk wajib melewati In-Memory Caching (TTL 5 Menit)"
// stdTTL: 300 seconds (5 minutes)
export const referenceCache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

// Helper keys
export const CACHE_KEYS = {
	PARTS: "master_parts",
	MATERIALS: "master_materials",
	DEFECTS: "master_defects",
	EMPLOYEES: "master_employees",
	ATTENDANCE_REPORT: "attendance_report",
};

export const invalidatePrefix = (prefix: string) => {
	const keys = referenceCache.keys();
	const toDelete = keys.filter((k) => k.startsWith(prefix));
	if (toDelete.length > 0) {
		referenceCache.del(toDelete);
	}
};
