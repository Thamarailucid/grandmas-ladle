-- Migration: Add is_listed column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_listed BOOLEAN NOT NULL DEFAULT TRUE;
UPDATE products SET is_listed = TRUE WHERE is_listed IS NULL;
