/*
  Warnings:

  - You are about to drop the column `variantId` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,productId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_variantId_fkey";

-- DropIndex
DROP INDEX "Review_userId_variantId_key";

-- DropIndex
DROP INDEX "Review_variantId_idx";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "averageRating" DOUBLE PRECISION,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "soldCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "variantId",
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "productId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Review_productId_idx" ON "Review"("productId");

-- CreateIndex
CREATE INDEX "Review_rating_idx" ON "Review"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_productId_key" ON "Review"("userId", "productId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
