-- „Continuă cu Google”: conturile create prin Google nu au parolă.
-- Aditivă: doar ridică NOT NULL de pe users.password_hash; datele existente rămân neatinse.

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;
