-- Add image_fit column to hero_slides table to allow admin to choose how hero images are framed
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS image_fit VARCHAR(50) DEFAULT 'cover-center';
