-- Migration: Add is_on_sale to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE products ALTER COLUMN is_vegetarian SET DEFAULT TRUE;
UPDATE products SET is_vegetarian = TRUE WHERE is_vegetarian IS NULL OR is_vegetarian = FALSE;
