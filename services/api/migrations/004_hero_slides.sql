CREATE TABLE IF NOT EXISTS hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    cta_text TEXT,
    cta_link TEXT,
    is_image_only BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_timestamp_hero_slides ON hero_slides;
CREATE TRIGGER set_timestamp_hero_slides
BEFORE UPDATE ON hero_slides
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Seed initial slide
INSERT INTO hero_slides (image_url, title, subtitle, cta_text, cta_link, is_image_only, sort_order)
SELECT 
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070',
    'GRANDMA''S LADLE',
    'Traditional goodness, from our kitchen to yours. Wholesome traditional foods, homemade snacks and timeless recipes inspired by the women who taught us the meaning of hard work and feeding with love.',
    'ORDER NOW',
    '/menu',
    false,
    0
WHERE NOT EXISTS (SELECT 1 FROM hero_slides);
