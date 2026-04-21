-- Create trigger to automatically increment soldCount when OrderItem is created
CREATE OR REPLACE FUNCTION increment_product_sold_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "Product" 
  SET "soldCount" = "soldCount" + NEW.quantity
  WHERE id = (
    SELECT "productId" FROM "ProductVariant" WHERE id = NEW."variantId"
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trg_increment_product_sold_count ON "OrderItem";

-- Create trigger
CREATE TRIGGER trg_increment_product_sold_count
AFTER INSERT ON "OrderItem"
FOR EACH ROW
EXECUTE FUNCTION increment_product_sold_count();

-- Create trigger to automatically decrement soldCount when OrderItem is deleted
CREATE OR REPLACE FUNCTION decrement_product_sold_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "Product" 
  SET "soldCount" = GREATEST(0, "soldCount" - OLD.quantity)
  WHERE id = (
    SELECT "productId" FROM "ProductVariant" WHERE id = OLD."variantId"
  );
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trg_decrement_product_sold_count ON "OrderItem";

-- Create trigger
CREATE TRIGGER trg_decrement_product_sold_count
AFTER DELETE ON "OrderItem"
FOR EACH ROW
EXECUTE FUNCTION decrement_product_sold_count();

-- Create trigger to update average rating when Review is created or updated
CREATE OR REPLACE FUNCTION update_product_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "Product"
  SET "averageRating" = (
    SELECT AVG(rating)::FLOAT FROM "Review"
    WHERE "productId" = COALESCE(NEW."productId", OLD."productId")
    AND "deletedAt" IS NULL
  ),
  "reviewCount" = (
    SELECT COUNT(*) FROM "Review"
    WHERE "productId" = COALESCE(NEW."productId", OLD."productId")
    AND "deletedAt" IS NULL
  )
  WHERE id = COALESCE(NEW."productId", OLD."productId");
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trg_update_rating_on_review_insert ON "Review";
DROP TRIGGER IF EXISTS trg_update_rating_on_review_update ON "Review";
DROP TRIGGER IF EXISTS trg_update_rating_on_review_delete ON "Review";

-- Create triggers
CREATE TRIGGER trg_update_rating_on_review_insert
AFTER INSERT ON "Review"
FOR EACH ROW
EXECUTE FUNCTION update_product_average_rating();

CREATE TRIGGER trg_update_rating_on_review_update
AFTER UPDATE ON "Review"
FOR EACH ROW
EXECUTE FUNCTION update_product_average_rating();

CREATE TRIGGER trg_update_rating_on_review_delete
AFTER DELETE ON "Review"
FOR EACH ROW
EXECUTE FUNCTION update_product_average_rating();
