-- Migration: Add content_alignment to hero_slides
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS content_alignment VARCHAR(50) DEFAULT 'center';
