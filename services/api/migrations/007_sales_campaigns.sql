CREATE TABLE IF NOT EXISTS sales_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    announcement_text VARCHAR(255),
    announcement_link VARCHAR(255),
    is_announcement_active BOOLEAN DEFAULT false,
    is_global_sale_active BOOLEAN DEFAULT false,
    is_sale_widget_active BOOLEAN DEFAULT false,
    pre_visibility_days INTEGER DEFAULT 1,
    post_visibility_days INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    product_ids JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
