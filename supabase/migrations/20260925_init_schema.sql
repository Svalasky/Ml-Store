-- ==========================================================
-- MARKETPLACE AKUN MOBILE LEGENDS - SUPABASE INITIAL SCHEMA
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS (AKUN MOBILE LEGENDS)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    original_price NUMERIC CHECK (original_price IS NULL OR original_price >= 0),
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'inactive')),
    featured BOOLEAN DEFAULT false,
    
    -- Account Information
    level INTEGER DEFAULT 30,
    rank TEXT DEFAULT 'Mythic',
    server TEXT,
    battle_id TEXT,
    win_rate NUMERIC DEFAULT 50.0,
    total_matches INTEGER DEFAULT 0,
    
    -- Content Counts
    hero_count INTEGER DEFAULT 0,
    skin_count INTEGER DEFAULT 0,
    collector_count INTEGER DEFAULT 0,
    legend_count INTEGER DEFAULT 0,
    epic_count INTEGER DEFAULT 0,
    special_count INTEGER DEFAULT 0,
    elite_count INTEGER DEFAULT 0,
    season_skin_count INTEGER DEFAULT 0,
    
    terms TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PRODUCT IMAGES (SCREENSHOTS)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. PRODUCT SKINS (DAFTAR SKIN)
CREATE TABLE IF NOT EXISTS public.product_skins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    skin_name TEXT NOT NULL,
    hero_name TEXT,
    skin_type TEXT DEFAULT 'epic' CHECK (skin_type IN ('collector', 'legend', 'epic', 'special', 'elite', 'season', 'other')),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. PRODUCT HEROES (DAFTAR HERO)
CREATE TABLE IF NOT EXISTS public.product_heroes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    hero_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. CUSTOMERS (BUYERS)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'waiting_payment', 'paid', 'processing', 'completed', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'refunded')),
    customer_name TEXT,
    customer_whatsapp TEXT,
    customer_note TEXT,
    admin_note TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. ORDER STATUS HISTORY
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. BANNERS
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT,
    link_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    message TEXT NOT NULL,
    screenshot_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. STORE SETTINGS
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name TEXT NOT NULL DEFAULT 'MLBB Account Store',
    whatsapp_number TEXT NOT NULL DEFAULT '6281234567890',
    whatsapp_message_template TEXT,
    instagram TEXT,
    tiktok TEXT,
    telegram TEXT,
    email TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- INDEXES FOR PERFORMANCE
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_rank ON public.products(rank);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_skin_count ON public.products(skin_count);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_skins_product_id ON public.product_skins(product_id);
CREATE INDEX IF NOT EXISTS idx_product_heroes_product_id ON public.product_heroes(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_skins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read product_images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public read product_skins" ON public.product_skins FOR SELECT USING (true);
CREATE POLICY "Public read product_heroes" ON public.product_heroes FOR SELECT USING (true);
CREATE POLICY "Public read banners" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read store_settings" ON public.store_settings FOR SELECT USING (true);

-- Public create orders & customers
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert order_status_history" ON public.order_status_history FOR INSERT WITH CHECK (true);

-- Admin full access policies (Service role / Authenticated)
CREATE POLICY "Admin full access products" ON public.products FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access product_images" ON public.product_images FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access product_skins" ON public.product_skins FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access product_heroes" ON public.product_heroes FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access customers" ON public.customers FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access banners" ON public.banners FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access store_settings" ON public.store_settings FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ==========================================================
-- STORAGE BUCKET: ml-account-images
-- ==========================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('ml-account-images', 'ml-account-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access ml-account-images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'ml-account-images');

CREATE POLICY "Admin Upload ml-account-images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'ml-account-images');
