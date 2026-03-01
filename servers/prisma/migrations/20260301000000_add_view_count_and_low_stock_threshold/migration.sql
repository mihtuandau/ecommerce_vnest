-- AlterTable: thêm viewCount vào Product
ALTER TABLE "Product" ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable: thêm lowStockThreshold vào ProductVariant
ALTER TABLE "ProductVariant" ADD COLUMN "lowStockThreshold" INTEGER NOT NULL DEFAULT 5;

-- CreateIndex: index để sort theo viewCount
CREATE INDEX "Product_viewCount_idx" ON "Product"("viewCount");
