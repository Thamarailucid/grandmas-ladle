-- Add product_names array column to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS product_names TEXT[] DEFAULT '{}';
