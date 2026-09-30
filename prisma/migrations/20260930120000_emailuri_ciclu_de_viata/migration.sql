-- E-mailurile de după înregistrare și formularul pentru vizitatori.
-- Aditivă: coloane noi cu valori implicite și tabele noi; nu atinge datele existente.
--
-- users.marketing_opt_out / marketing_choice_at: bifa „Nu vreau emailuri cu noutăți
--   și sfaturi” de la înregistrare (Legea 506/2004 art. 12 alin. 2), cu momentul ei.
-- email_settings: momentul lansării (rândul 1, pus aici). Doar conturile și
--   vizitatorii creați după el primesc e-mailurile periodice.
-- leads: vizitatorii fără cont care au cerut ghidul primei constelații, cu acord.
-- email_log: fiecare e-mail trimis; dedupe_key unic („adresă:fel”) oprește dublurile.
-- email_unsubscribes: adresele dezabonate.

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "marketing_choice_at" TIMESTAMP(3),
ADD COLUMN     "marketing_opt_out" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "email_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "lifecycle_launched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "source_page" TEXT,
    "consent_at" TIMESTAMP(3) NOT NULL,
    "consent_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribed_at" TIMESTAMP(3),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_log" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" TEXT,
    "lead_id" TEXT,
    "kind" TEXT NOT NULL,
    "dedupe_key" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resend_id" TEXT,
    "error" TEXT,

    CONSTRAINT "email_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_unsubscribes" (
    "email" TEXT NOT NULL,
    "unsubscribed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email_log_id" TEXT,

    CONSTRAINT "email_unsubscribes_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "leads_email_key" ON "leads"("email");

-- CreateIndex
CREATE UNIQUE INDEX "email_log_dedupe_key_key" ON "email_log"("dedupe_key");

-- CreateIndex
CREATE INDEX "email_log_email_sent_at_idx" ON "email_log"("email", "sent_at" DESC);

-- CreateIndex
CREATE INDEX "email_log_kind_sent_at_idx" ON "email_log"("kind", "sent_at" DESC);

-- CreateIndex
CREATE INDEX "email_log_user_id_idx" ON "email_log"("user_id");

-- AddForeignKey
ALTER TABLE "email_log" ADD CONSTRAINT "email_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_log" ADD CONSTRAINT "email_log_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Momentul lansării: acum, când rulează migrarea.
INSERT INTO "email_settings" ("id", "lifecycle_launched_at") VALUES (1, CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING;
