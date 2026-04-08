-- NOTE:
-- viewCount và lowStockThreshold đã được thêm từ migration 20260120042028_improved_schema.
-- Giữ migration này để tạo index tương ứng theo cách an toàn/idempotent.

-- CreateIndex: index để sort theo viewCount
CREATE INDEX "Product_viewCount_idx" ON "Product"("viewCount");
