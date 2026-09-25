-- Factura Oblio a fiecarei plati (emisa automat din webhook-ul Stripe; eroarea ramane pentru reluare)
ALTER TABLE "pack_purchases" ADD COLUMN IF NOT EXISTS "invoice_series" TEXT;
ALTER TABLE "pack_purchases" ADD COLUMN IF NOT EXISTS "invoice_number" TEXT;
ALTER TABLE "pack_purchases" ADD COLUMN IF NOT EXISTS "invoice_url" TEXT;
ALTER TABLE "pack_purchases" ADD COLUMN IF NOT EXISTS "invoice_error" TEXT;
