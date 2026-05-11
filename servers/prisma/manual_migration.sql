-- 1. Create AiRole enum
DO $$ BEGIN
  CREATE TYPE "AiRole" AS ENUM ('USER', 'MODEL', 'SYSTEM');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Convert AiMessage.role from String to AiRole enum (safely)
ALTER TABLE "AiMessage" ADD COLUMN "role_new" "AiRole";
UPDATE "AiMessage" SET "role_new" = 
  CASE 
    WHEN UPPER("role") = 'USER' THEN 'USER'::"AiRole"
    WHEN UPPER("role") = 'MODEL' THEN 'MODEL'::"AiRole"
    WHEN UPPER("role") = 'SYSTEM' THEN 'SYSTEM'::"AiRole"
    ELSE 'USER'::"AiRole"
  END;
ALTER TABLE "AiMessage" DROP COLUMN "role";
ALTER TABLE "AiMessage" RENAME COLUMN "role_new" TO "role";
ALTER TABLE "AiMessage" ALTER COLUMN "role" SET NOT NULL;

-- 3. Rename Banner.order to Banner.displayOrder (if column exists)
DO $$ BEGIN
  ALTER TABLE "Banner" RENAME COLUMN "order" TO "displayOrder";
EXCEPTION
  WHEN undefined_column THEN null;
END $$;

-- 4. Create ReviewImage table
CREATE TABLE IF NOT EXISTS "ReviewImage" (
  "id" SERIAL PRIMARY KEY,
  "reviewId" INTEGER NOT NULL,
  "url" TEXT NOT NULL,
  CONSTRAINT "ReviewImage_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "ReviewImage_reviewId_idx" ON "ReviewImage"("reviewId");

-- 5. Migrate existing Review.images (String[]) to ReviewImage records
DO $$ 
DECLARE
  r RECORD;
  img TEXT;
BEGIN
  FOR r IN SELECT id, images FROM "Review" WHERE array_length(images, 1) > 0 LOOP
    FOREACH img IN ARRAY r.images LOOP
      INSERT INTO "ReviewImage" ("reviewId", "url") VALUES (r.id, img);
    END LOOP;
  END LOOP;
EXCEPTION
  WHEN undefined_column THEN null; -- images column already dropped
END $$;

-- 6. Drop the old images column from Review
DO $$ BEGIN
  ALTER TABLE "Review" DROP COLUMN "images";
EXCEPTION
  WHEN undefined_column THEN null;
END $$;

-- 7. Make ProductVariant dimensions nullable (remove defaults)
ALTER TABLE "ProductVariant" ALTER COLUMN "weight" DROP NOT NULL;
ALTER TABLE "ProductVariant" ALTER COLUMN "weight" DROP DEFAULT;
ALTER TABLE "ProductVariant" ALTER COLUMN "length" DROP NOT NULL;
ALTER TABLE "ProductVariant" ALTER COLUMN "length" DROP DEFAULT;
ALTER TABLE "ProductVariant" ALTER COLUMN "width" DROP NOT NULL;
ALTER TABLE "ProductVariant" ALTER COLUMN "width" DROP DEFAULT;
ALTER TABLE "ProductVariant" ALTER COLUMN "height" DROP NOT NULL;
ALTER TABLE "ProductVariant" ALTER COLUMN "height" DROP DEFAULT;

-- 8. Drop composite index that was removed from schema
DROP INDEX IF EXISTS "Review_productId_rating_idx";
