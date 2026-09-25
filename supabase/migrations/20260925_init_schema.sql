-- ==============================================================================
-- MOLE STORE - SUPABASE DATABASE INITIAL MIGRATION
-- Architecture: PostgreSQL + Supabase Auth + Supabase Storage + RLS
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS & HELPERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. PROFILES (Supabase Auth Integration)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT,
    price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    original_price NUMERIC(15, 2),
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'out_of_stock', 'inactive')),
    featured BOOLEAN NOT NULL DEFAULT false,
    duration TEXT,
    terms TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    original_price NUMERIC(15, 2),
    duration TEXT,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'out_of_stock', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_product_variants_updated_at
    BEFORE UPDATE ON public.product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. INVENTORY
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL UNIQUE REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_inventory_updated_at
    BEFORE UPDATE ON public.inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. DIGITAL ACCOUNTS (Credentials Storage - Admin/Backend Only)
CREATE TABLE IF NOT EXISTS public.digital_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    username TEXT,
    credential_reference TEXT,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'expired', 'disabled')),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_digital_accounts_updated_at
    BEFORE UPDATE ON public.digital_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. CUSTOMERS
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    whatsapp_number TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 10. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total NUMERIC(15, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'waiting_payment', 'paid', 'processing', 'completed', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'refunded')),
    payment_method TEXT NOT NULL DEFAULT 'whatsapp' CHECK (payment_method IN ('whatsapp', 'manual_transfer', 'other')),
    customer_note TEXT,
    admin_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 11. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    variant_name TEXT,
    price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. ORDER STATUS HISTORY
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    note TEXT,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. BANNERS
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    button_text TEXT,
    button_url TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_banners_updated_at
    BEFORE UPDATE ON public.banners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 14. PROMOTIONS
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(15, 2) NOT NULL,
    minimum_purchase NUMERIC(15, 2) NOT NULL DEFAULT 0,
    start_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_promotions_updated_at
    BEFORE UPDATE ON public.promotions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 15. TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    image_url TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. STORE SETTINGS
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name TEXT NOT NULL DEFAULT 'Mole Store',
    description TEXT,
    logo_url TEXT,
    whatsapp_number TEXT NOT NULL DEFAULT '6281234567890',
    whatsapp_message TEXT DEFAULT 'Halo Admin Mole Store, saya ingin memesan...',
    instagram_url TEXT,
    tiktok_url TEXT,
    telegram_url TEXT,
    email TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_store_settings_updated_at
    BEFORE UPDATE ON public.store_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(active);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_status ON public.product_variants(status);

CREATE INDEX IF NOT EXISTS idx_inventory_variant_id ON public.inventory(variant_id);

CREATE INDEX IF NOT EXISTS idx_digital_accounts_variant_id ON public.digital_accounts(variant_id);
CREATE INDEX IF NOT EXISTS idx_digital_accounts_status ON public.digital_accounts(status);

CREATE INDEX IF NOT EXISTS idx_customers_whatsapp ON public.customers(whatsapp_number);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON public.order_status_history(order_id);

CREATE INDEX IF NOT EXISTS idx_banners_active_sort ON public.banners(active, sort_order);
CREATE INDEX IF NOT EXISTS idx_promotions_code ON public.promotions(code);

-- ==============================================================================
-- STORED PROCEDURES / FUNCTIONS
-- ==============================================================================

-- Sequence generator for Order Numbers: ORD-YYYYMMDD-XXXX
CREATE SEQUENCE IF NOT EXISTS order_number_seq;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    v_date TEXT;
    v_seq_val INT;
    v_order_num TEXT;
BEGIN
    v_date := TO_CHAR(NOW(), 'YYYYMMDD');
    v_seq_val := NEXTVAL('order_number_seq') % 10000;
    v_order_num := 'ORD-' || v_date || '-' || LPAD(v_seq_val::TEXT, 4, '0');
    RETURN v_order_num;
END;
$$ LANGUAGE plpgsql;

-- WhatsApp Order Creation RPC
CREATE OR REPLACE FUNCTION public.create_whatsapp_order(
    p_customer_name TEXT,
    p_whatsapp_number TEXT,
    p_product_id UUID,
    p_variant_id UUID DEFAULT NULL,
    p_customer_note TEXT DEFAULT NULL,
    p_discount_code TEXT DEFAULT NULL
)
RETURNS TABLE (
    order_id UUID,
    order_number TEXT,
    total NUMERIC,
    product_name TEXT,
    variant_name TEXT,
    status TEXT
) AS $$
DECLARE
    v_customer_id UUID;
    v_order_id UUID;
    v_order_number TEXT;
    v_prod RECORD;
    v_var RECORD;
    v_item_price NUMERIC;
    v_item_name TEXT;
    v_item_variant_name TEXT;
    v_discount NUMERIC := 0;
    v_total NUMERIC;
BEGIN
    -- 1. Find or create customer
    SELECT id INTO v_customer_id FROM public.customers WHERE whatsapp_number = p_whatsapp_number LIMIT 1;
    IF v_customer_id IS NULL THEN
        INSERT INTO public.customers (name, whatsapp_number)
        VALUES (p_customer_name, p_whatsapp_number)
        RETURNING id INTO v_customer_id;
    ELSE
        UPDATE public.customers
        SET name = COALESCE(p_customer_name, name), updated_at = NOW()
        WHERE id = v_customer_id;
    END IF;

    -- 2. Fetch Product
    SELECT * INTO v_prod FROM public.products WHERE id = p_product_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product with ID % not found', p_product_id;
    END IF;

    v_item_name := v_prod.name;
    v_item_price := v_prod.price;

    -- 3. Fetch Variant if specified
    IF p_variant_id IS NOT NULL THEN
        SELECT * INTO v_var FROM public.product_variants WHERE id = p_variant_id AND product_id = p_product_id;
        IF FOUND THEN
            v_item_variant_name := v_var.name;
            v_item_price := v_var.price;
        END IF;
    END IF;

    -- 4. Calculate Discount if promo code provided
    IF p_discount_code IS NOT NULL AND p_discount_code <> '' THEN
        DECLARE
            v_promo RECORD;
        BEGIN
            SELECT * INTO v_promo FROM public.promotions
            WHERE code = UPPER(p_discount_code) AND active = true
            AND (start_at IS NULL OR start_at <= NOW())
            AND (end_at IS NULL OR end_at >= NOW())
            AND v_item_price >= minimum_purchase;

            IF FOUND THEN
                IF v_promo.discount_type = 'percentage' THEN
                    v_discount := ROUND((v_item_price * (v_promo.discount_value / 100.0)), 2);
                ELSE
                    v_discount := LEAST(v_promo.discount_value, v_item_price);
                END IF;
            END IF;
        END;
    END IF;

    v_total := GREATEST(0, v_item_price - v_discount);
    v_order_number := public.generate_order_number();

    -- 5. Insert Order
    INSERT INTO public.orders (
        order_number,
        customer_id,
        subtotal,
        discount,
        total,
        status,
        payment_status,
        payment_method,
        customer_note
    ) VALUES (
        v_order_number,
        v_customer_id,
        v_item_price,
        v_discount,
        v_total,
        'pending',
        'unpaid',
        'whatsapp',
        p_customer_note
    ) RETURNING id INTO v_order_id;

    -- 6. Insert Order Item
    INSERT INTO public.order_items (
        order_id,
        product_id,
        variant_id,
        product_name,
        variant_name,
        price,
        quantity,
        subtotal
    ) VALUES (
        v_order_id,
        p_product_id,
        p_variant_id,
        v_item_name,
        v_item_variant_name,
        v_item_price,
        1,
        v_item_price
    );

    -- 7. Insert Initial Order Status History
    INSERT INTO public.order_status_history (
        order_id,
        old_status,
        new_status,
        note
    ) VALUES (
        v_order_id,
        NULL,
        'pending',
        'Order dibuat melalui WhatsApp Checkout'
    );

    -- 8. Return Result
    RETURN QUERY SELECT
        v_order_id,
        v_order_number,
        v_total,
        v_item_name,
        v_item_variant_name,
        'pending'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update Order Status RPC
CREATE OR REPLACE FUNCTION public.update_order_status(
    p_order_id UUID,
    p_new_status TEXT,
    p_payment_status TEXT DEFAULT NULL,
    p_admin_note TEXT DEFAULT NULL,
    p_note TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_old_status TEXT;
BEGIN
    SELECT status INTO v_old_status FROM public.orders WHERE id = p_order_id;
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    UPDATE public.orders
    SET
        status = p_new_status,
        payment_status = COALESCE(p_payment_status, payment_status),
        admin_note = COALESCE(p_admin_note, admin_note),
        updated_at = NOW()
    WHERE id = p_order_id;

    INSERT INTO public.order_status_history (
        order_id,
        old_status,
        new_status,
        note,
        changed_by
    ) VALUES (
        p_order_id,
        v_old_status,
        p_new_status,
        COALESCE(p_note, 'Status diperbarui menjadi ' || p_new_status),
        auth.uid()
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Handle New Auth User -> Profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin/staff
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROFILES
CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE USING (public.is_admin());

-- 2. CATEGORIES
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (active = true OR public.is_staff_or_admin());
CREATE POLICY "Staff can manage categories" ON public.categories FOR ALL USING (public.is_staff_or_admin());

-- 3. PRODUCTS
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (status IN ('available', 'out_of_stock') OR public.is_staff_or_admin());
CREATE POLICY "Staff can manage products" ON public.products FOR ALL USING (public.is_staff_or_admin());

-- 4. PRODUCT VARIANTS
CREATE POLICY "Public can view active variants" ON public.product_variants FOR SELECT USING (status IN ('available', 'out_of_stock') OR public.is_staff_or_admin());
CREATE POLICY "Staff can manage variants" ON public.product_variants FOR ALL USING (public.is_staff_or_admin());

-- 5. INVENTORY
CREATE POLICY "Staff can view inventory" ON public.inventory FOR SELECT USING (public.is_staff_or_admin());
CREATE POLICY "Staff can manage inventory" ON public.inventory FOR ALL USING (public.is_staff_or_admin());

-- 6. DIGITAL ACCOUNTS (Credentials - Strict Admin Only)
CREATE POLICY "Admins can manage digital accounts" ON public.digital_accounts FOR ALL USING (public.is_admin());

-- 7. CUSTOMERS
CREATE POLICY "Staff can view customers" ON public.customers FOR SELECT USING (public.is_staff_or_admin());
CREATE POLICY "Staff can manage customers" ON public.customers FOR ALL USING (public.is_staff_or_admin());

-- 8. ORDERS & ORDER ITEMS
CREATE POLICY "Staff can view orders" ON public.orders FOR SELECT USING (public.is_staff_or_admin());
CREATE POLICY "Staff can manage orders" ON public.orders FOR ALL USING (public.is_staff_or_admin());
CREATE POLICY "Staff can view order items" ON public.order_items FOR SELECT USING (public.is_staff_or_admin());
CREATE POLICY "Staff can manage order items" ON public.order_items FOR ALL USING (public.is_staff_or_admin());

-- 9. ORDER STATUS HISTORY
CREATE POLICY "Staff can view order history" ON public.order_status_history FOR SELECT USING (public.is_staff_or_admin());
CREATE POLICY "Staff can insert order history" ON public.order_status_history FOR INSERT WITH CHECK (public.is_staff_or_admin());

-- 10. BANNERS
CREATE POLICY "Public can view active banners" ON public.banners FOR SELECT USING (active = true OR public.is_staff_or_admin());
CREATE POLICY "Staff can manage banners" ON public.banners FOR ALL USING (public.is_staff_or_admin());

-- 11. PROMOTIONS
CREATE POLICY "Public can view active promotions" ON public.promotions FOR SELECT USING (active = true OR public.is_staff_or_admin());
CREATE POLICY "Staff can manage promotions" ON public.promotions FOR ALL USING (public.is_staff_or_admin());

-- 12. TESTIMONIALS
CREATE POLICY "Public can view active testimonials" ON public.testimonials FOR SELECT USING (active = true OR public.is_staff_or_admin());
CREATE POLICY "Staff can manage testimonials" ON public.testimonials FOR ALL USING (public.is_staff_or_admin());

-- 13. STORE SETTINGS
CREATE POLICY "Public can view store settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update store settings" ON public.store_settings FOR ALL USING (public.is_admin());

-- ==============================================================================
-- STORAGE BUCKETS (Product Images)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Staff can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Staff can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Staff can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
