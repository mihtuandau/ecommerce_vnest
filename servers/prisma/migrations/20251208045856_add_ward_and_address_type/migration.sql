-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "addressType" TEXT DEFAULT 'home',
ADD COLUMN     "ward" TEXT,
ALTER COLUMN "zipCode" DROP NOT NULL;
