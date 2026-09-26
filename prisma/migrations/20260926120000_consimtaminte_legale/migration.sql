-- Consimtaminte legale (coloane noi, toate NULLABLE; nu atinge datele existente)
-- users: acceptarea Termenilor la inregistrare
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "terms_accepted_at" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "terms_version" TEXT;
-- saved_constellations: consimtamantul explicit (art. 9 GDPR) pentru prelucrarea prin AI
ALTER TABLE "saved_constellations" ADD COLUMN IF NOT EXISTS "ai_consent_at" TIMESTAMP(3);
-- pack_purchases: acordul pentru furnizarea imediata si pierderea dreptului de retragere
ALTER TABLE "pack_purchases" ADD COLUMN IF NOT EXISTS "consent_at" TIMESTAMP(3);
ALTER TABLE "pack_purchases" ADD COLUMN IF NOT EXISTS "terms_version" TEXT;
