-- Fix category cascade - set categoryId to NULL for orphaned products
-- This handles products whose categories were deleted

-- First, identify and fix orphaned products (products with categoryId that don't exist in Category table)
UPDATE "Product"
SET "categoryId" = NULL
WHERE "categoryId" IS NOT NULL
  AND "categoryId" NOT IN (SELECT id FROM "Category");

-- Add constraint to ensure referential integrity going forward
-- This allows NULL but ensures valid categories are referenced
ALTER TABLE "Product"
DROP CONSTRAINT IF EXISTS "Product_categoryId_fkey";

ALTER TABLE "Product"
ADD CONSTRAINT "Product_categoryId_fkey" 
FOREIGN KEY ("categoryId") REFERENCES "Category"("id") 
ON DELETE SET NULL;

-- Add comment explaining this change
COMMENT ON CONSTRAINT "Product_categoryId_fkey" ON "Product" 
IS 'Cascades to NULL when category is deleted, preventing orphaned products';
