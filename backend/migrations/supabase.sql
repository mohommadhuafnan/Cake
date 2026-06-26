-- ═══════════════════════════════════════════════════════════════════════════
-- Maison Douceur — FULL Supabase Schema
-- Run this ENTIRE file in: Supabase Dashboard → SQL Editor → New query → Run
-- Project: fipsclbgsrjldhtdaumj
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Categories ───
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  image TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Products ───
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  price NUMERIC(10,2) NOT NULL,
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  stock INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews INT DEFAULT 0,
  popular INT DEFAULT 80,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Customer profiles (Firebase UID) ───
CREATE TABLE IF NOT EXISTS customer_profiles (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  city TEXT DEFAULT 'Doha',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Orders ───
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id TEXT REFERENCES customer_profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  city TEXT DEFAULT 'Doha',
  subtotal NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'card' CHECK (payment_method IN ('card', 'whatsapp', 'cash')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'baking', 'ready', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Order items ───
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL
);

-- ─── Coupons ───
CREATE TABLE IF NOT EXISTS coupons (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('fixed', 'percentage')),
  value NUMERIC(10,2) NOT NULL,
  min_order NUMERIC(10,2) DEFAULT 0,
  max_uses INT,
  used_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Custom cake orders ───
CREATE TABLE IF NOT EXISTS custom_cake_orders (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT REFERENCES customer_profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  cake_size TEXT NOT NULL,
  flavor TEXT NOT NULL,
  design_description TEXT,
  delivery_date DATE NOT NULL,
  special_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'quoted', 'confirmed', 'completed', 'cancelled')),
  quoted_price NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Contact messages ───
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Newsletter ───
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Wishlist ───
CREATE TABLE IF NOT EXISTS wishlist (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- ─── Reviews ───
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Delivery tracking log ───
CREATE TABLE IF NOT EXISTS delivery_tracking (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ ROW LEVEL SECURITY ═══
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_cake_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Public read catalog
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (true);
CREATE POLICY "public_read_products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_coupons" ON coupons FOR SELECT USING (is_active = true);

-- Orders: anyone can place & track by order number
CREATE POLICY "public_insert_orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_orders" ON orders FOR SELECT USING (true);
CREATE POLICY "public_update_orders" ON orders FOR UPDATE USING (true);

CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_order_items" ON order_items FOR SELECT USING (true);

-- Contact, custom orders, newsletter
CREATE POLICY "public_insert_contact" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_contact" ON contact_messages FOR SELECT USING (true);

CREATE POLICY "public_insert_custom" ON custom_cake_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_custom" ON custom_cake_orders FOR SELECT USING (true);

CREATE POLICY "public_insert_newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Profiles & wishlist
CREATE POLICY "public_upsert_profiles" ON customer_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_wishlist" ON wishlist FOR ALL USING (true) WITH CHECK (true);

-- Reviews
CREATE POLICY "public_insert_reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT USING (is_approved = true);

CREATE POLICY "public_read_tracking" ON delivery_tracking FOR SELECT USING (true);
CREATE POLICY "public_insert_tracking" ON delivery_tracking FOR INSERT WITH CHECK (true);

-- ═══ SEED DATA ═══
INSERT INTO categories (slug, name_en, name_ar, sort_order) VALUES
  ('wedding', 'Wedding', 'أعراس', 1),
  ('birthday', 'Birthday', 'أعياد ميلاد', 2),
  ('corporate', 'Corporate', 'شركات', 3),
  ('seasonal', 'Seasonal', 'موسمي', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name_en, name_ar, description_en, description_ar, price, image, stock, rating, reviews, popular)
SELECT c.id, v.name_en, v.name_ar, v.description_en, v.description_ar, v.price, v.image, v.stock, v.rating, v.reviews, v.popular
FROM (VALUES
  ('wedding', 'Rose Gold Elegance', 'أناقة الذهب الوردي', 'Layers of vanilla sponge with rose-infused buttercream.', 'طبقات من الكيك الفانيليا مع كريمة الورد.', 450, 'https://images.unsplash.com/photo-1486427949362-c0aa028e0666?w=800&q=80', 10, 4.9, 24, 95),
  ('birthday', 'Midnight Chocolate', 'شوكولاتة منتصف الليل', 'Rich dark chocolate ganache with Belgian cocoa.', 'غاناش شوكولاتة داكنة غنية.', 320, 'https://images.unsplash.com/photo-1606317138400-f2899e2919ee?w=800&q=80', 15, 4.8, 18, 88),
  ('birthday', 'Blush Berry Dream', 'حلم التوت الوردي', 'Light sponge with mixed berry compote.', 'كيك خفيف مع كومبوت التوت.', 280, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', 12, 4.7, 31, 82),
  ('corporate', 'Corporate Signature', 'التوقيع المؤسسي', 'Minimalist design for corporate events.', 'تصميم بسيط للفعاليات المؤسسية.', 550, 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80', 8, 4.9, 12, 75),
  ('seasonal', 'Ramadan Crescent', 'هلال رمضان', 'Seasonal creation with dates and pistachio.', 'إبداع موسمي بالتمر والفستق.', 380, 'https://images.unsplash.com/photo-1625866448531-1b00c0251f76?w=800&q=80', 20, 5.0, 45, 98),
  ('wedding', 'Pearl Wedding Tower', 'برج اللؤلؤ للأعراس', 'Five-tier masterpiece with pearl fondant.', 'تحفة من خمس طبقات.', 1200, 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80', 3, 5.0, 8, 100)
) AS v(cat_slug, name_en, name_ar, description_en, description_ar, price, image, stock, rating, reviews, popular)
JOIN categories c ON c.slug = v.cat_slug
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

INSERT INTO coupons (code, type, value, min_order, max_uses, expires_at) VALUES
  ('WELCOME10', 'percentage', 10, 100, 100, NOW() + INTERVAL '1 year'),
  ('FLAT50', 'fixed', 50, 200, 50, NOW() + INTERVAL '6 months')
ON CONFLICT (code) DO NOTHING;

-- Index for fast order lookup
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
