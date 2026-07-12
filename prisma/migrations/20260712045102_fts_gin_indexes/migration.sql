-- Create extension for trigram matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add GIN indexes for fast full-text search on MasterPart
CREATE INDEX IF NOT EXISTS "idx_m_part_name_gin" ON "m_part" USING gin("nama_part" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "idx_m_part_no_gin" ON "m_part" USING gin("part_no" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "idx_m_part_uniq_no_gin" ON "m_part" USING gin("uniq_no" gin_trgm_ops);

-- Add GIN indexes for MasterEmployee
CREATE INDEX IF NOT EXISTS "idx_m_employee_name_gin" ON "m_karyawan" USING gin("nama_lengkap" gin_trgm_ops);