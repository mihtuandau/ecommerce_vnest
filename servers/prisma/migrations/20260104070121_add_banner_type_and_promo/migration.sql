-- CreateEnum
CREATE TYPE "BannerType" AS ENUM ('HERO', 'PROMO');

-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "badge" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "type" "BannerType" NOT NULL DEFAULT 'HERO';
