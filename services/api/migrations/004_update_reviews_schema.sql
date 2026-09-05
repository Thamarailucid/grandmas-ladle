-- Migration: 004_update_reviews_schema.sql
-- Adds is_approved and is_verified for customer reviews moderation and trust badges

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- Set existing reviews as approved and verified
UPDATE reviews 
SET is_approved = TRUE, is_verified = TRUE, is_published = TRUE 
WHERE is_deleted = FALSE;
