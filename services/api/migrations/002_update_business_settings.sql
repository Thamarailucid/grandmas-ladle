-- Add sale dates and cart toggle to business_settings
ALTER TABLE business_settings ADD COLUMN IF NOT EXISTS sale_start_date TIMESTAMPTZ NULL;
ALTER TABLE business_settings ADD COLUMN IF NOT EXISTS sale_end_date TIMESTAMPTZ NULL;
ALTER TABLE business_settings ADD COLUMN IF NOT EXISTS is_cart_enabled BOOLEAN DEFAULT true;
ALTER TABLE business_settings ADD COLUMN IF NOT EXISTS sale_product_ids UUID[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC(12,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS offer_price NUMERIC(12,2);
ALTER TABLE business_settings ADD COLUMN IF NOT EXISTS is_global_sale_active BOOLEAN DEFAULT false;
ALTER TABLE business_settings ADD COLUMN IF NOT EXISTS is_sale_widget_active BOOLEAN DEFAULT false;
