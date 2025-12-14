/*
  Warnings:

  - A unique constraint covering the columns `[payosOrderCode]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'PAYOS';

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentLink" TEXT,
ADD COLUMN     "payosOrderCode" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_payosOrderCode_key" ON "Payment"("payosOrderCode");

-- CreateIndex
CREATE INDEX "Payment_payosOrderCode_idx" ON "Payment"("payosOrderCode");
