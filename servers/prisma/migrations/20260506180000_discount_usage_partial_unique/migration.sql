-- Chống race condition: 1 user/email/phone chỉ được dùng 1 voucher 1 lần.
-- Postgres partial unique index (Prisma chưa hỗ trợ trực tiếp qua schema.prisma).

CREATE TABLE IF NOT EXISTS "DiscountUsage" (
  "id" SERIAL NOT NULL,
  "userId" INTEGER,
  "guestEmail" TEXT,
  "guestPhone" TEXT,
  "discountId" INTEGER NOT NULL,
  "orderId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DiscountUsage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "DiscountUsage_orderId_key"
  ON "DiscountUsage" ("orderId");

CREATE INDEX IF NOT EXISTS "DiscountUsage_userId_idx"
  ON "DiscountUsage" ("userId");

CREATE INDEX IF NOT EXISTS "DiscountUsage_guestEmail_idx"
  ON "DiscountUsage" ("guestEmail");

CREATE INDEX IF NOT EXISTS "DiscountUsage_guestPhone_idx"
  ON "DiscountUsage" ("guestPhone");

CREATE INDEX IF NOT EXISTS "DiscountUsage_discountId_idx"
  ON "DiscountUsage" ("discountId");

ALTER TABLE "DiscountUsage"
  DROP CONSTRAINT IF EXISTS "DiscountUsage_userId_fkey";

ALTER TABLE "DiscountUsage"
  ADD CONSTRAINT "DiscountUsage_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DiscountUsage"
  DROP CONSTRAINT IF EXISTS "DiscountUsage_discountId_fkey";

ALTER TABLE "DiscountUsage"
  ADD CONSTRAINT "DiscountUsage_discountId_fkey"
  FOREIGN KEY ("discountId") REFERENCES "Discount"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DiscountUsage"
  DROP CONSTRAINT IF EXISTS "DiscountUsage_orderId_fkey";

ALTER TABLE "DiscountUsage"
  ADD CONSTRAINT "DiscountUsage_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS "DiscountUsage_userId_discountId_unique"
  ON "DiscountUsage" ("userId", "discountId")
  WHERE "userId" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "DiscountUsage_guestEmail_discountId_unique"
  ON "DiscountUsage" ("guestEmail", "discountId")
  WHERE "guestEmail" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "DiscountUsage_guestPhone_discountId_unique"
  ON "DiscountUsage" ("guestPhone", "discountId")
  WHERE "guestPhone" IS NOT NULL;
