-- Trecere de la plată per-constelație la pachete de credite reîncărcabile.
--
-- Până acum: un singur preț Stripe, o plată deblochează raportul complet al
-- unei singure constelații. Problema: cine explorează mai multe teme (bani,
-- relații, rolul de părinte...) plătea de fiecare dată de la zero, prin
-- Stripe, fără nicio legătură între plăți.
--
-- Acum: se cumpără un pachet de credite (Stripe, o dată), fiecare credit
-- deblochează raportul complet al oricărei constelații viitoare. Baza era
-- goală (0 utilizatori, 0 plăți) când s-a scris migrarea — nu era nimic de
-- păstrat din `payments`.

-- ---------------------------------------------------------------- pachete

CREATE TABLE "packs" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "packs_pkey" PRIMARY KEY ("code")
);

-- Prețuri de plecare — de ajustat de la owner, e doar un rând în tabel.
-- Reducerea per credit crește cu pachetul, ca la tiparementale (35/79/169 lei
-- pentru 3/8/20 ședințe): cine cumpără mai mult plătește mai puțin pe unitate.
INSERT INTO "packs" ("code", "name", "price_cents", "credits", "sort_order", "active") VALUES
    ('un-raport',        'Un raport',        3900,  1, 1, true),
    ('trei-rapoarte',    'Trei rapoarte',    9900,  3, 2, true),
    ('cinci-rapoarte',   'Cinci rapoarte',   14900, 5, 3, true);

-- ---------------------------------------------------------------- portofel

CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "credits_balance" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Conturile existente (dacă vreunul a apucat să se înregistreze) primesc un
-- portofel gol — nu era nimic de creditat retroactiv.
INSERT INTO "wallets" ("id", "user_id", "credits_balance", "updated_at")
SELECT gen_random_uuid(), "id", 0, CURRENT_TIMESTAMP FROM "users"
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------- cumpărări

CREATE TABLE "pack_purchases" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "pack_code" TEXT NOT NULL,
    "stripe_checkout_session_id" TEXT NOT NULL,
    "stripe_payment_intent_id" TEXT,
    "amount_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pack_purchases_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "pack_purchases_stripe_checkout_session_id_key" ON "pack_purchases"("stripe_checkout_session_id");
CREATE INDEX "pack_purchases_user_id_created_at_idx" ON "pack_purchases"("user_id", "created_at" DESC);

ALTER TABLE "pack_purchases" ADD CONSTRAINT "pack_purchases_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "pack_purchases" ADD CONSTRAINT "pack_purchases_pack_code_fkey"
    FOREIGN KEY ("pack_code") REFERENCES "packs"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ---------------------------------------------------------------- deblocări

CREATE TABLE "report_unlocks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "constellation_id" TEXT NOT NULL,
    "credits_spent" INTEGER NOT NULL DEFAULT 1,
    "unlocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_unlocks_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "report_unlocks_constellation_id_key" ON "report_unlocks"("constellation_id");

ALTER TABLE "report_unlocks" ADD CONSTRAINT "report_unlocks_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "report_unlocks" ADD CONSTRAINT "report_unlocks_constellation_id_fkey"
    FOREIGN KEY ("constellation_id") REFERENCES "saved_constellations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------- vechiul model

DROP TABLE "payments";
