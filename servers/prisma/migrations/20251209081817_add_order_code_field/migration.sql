/*
  Warnings:

  - A unique constraint covering the columns `[orderCode]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderCode" TEXT;

-- Update existing orders with generated order codes
DO $$
DECLARE
    rec RECORD;
    new_code TEXT;
BEGIN
    FOR rec IN SELECT id FROM "Order" WHERE "orderCode" IS NULL
    LOOP
        new_code := 'ORD-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || rec.id::TEXT) FROM 1 FOR 6));
        UPDATE "Order" SET "orderCode" = new_code WHERE id = rec.id;
    END LOOP;
END $$;

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderCode_key" ON "Order"("orderCode");
