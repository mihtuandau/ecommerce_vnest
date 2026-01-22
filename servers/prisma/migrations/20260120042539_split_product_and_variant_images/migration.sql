/*
  Warnings:

  - You are about to drop the column `variantId` on the `ProductImage` table. All the data in the column will be lost.
  - Made the column `productId` on table `ProductImage` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_variantId_fkey";

-- DropIndex
DROP INDEX "ProductImage_variantId_idx";

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "variantId",
ALTER COLUMN "productId" SET NOT NULL;

-- CreateTable
CREATE TABLE "VariantImage" (
    "id" SERIAL NOT NULL,
    "variantId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VariantImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VariantImage_variantId_idx" ON "VariantImage"("variantId");

-- CreateIndex
CREATE INDEX "VariantImage_variantId_displayOrder_idx" ON "VariantImage"("variantId", "displayOrder");

-- CreateIndex
CREATE INDEX "ProductImage_productId_displayOrder_idx" ON "ProductImage"("productId", "displayOrder");

-- AddForeignKey
ALTER TABLE "VariantImage" ADD CONSTRAINT "VariantImage_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
