-- ═══════════════════════════════════════════════════════════════════════════
-- Maison Douceur — COMPLETE SUPABASE SETUP (ONE FILE)
-- Use this ONLY for a BRAND NEW empty Supabase project.
--
-- Supabase Dashboard → SQL Editor → New query → paste ALL → Run
--
-- If you ALREADY have tables / got errors before:
--   Run ONLY: supabase_RUN_THIS.sql  (do NOT run this complete file)
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- PART 1 — Full database schema (tables, security, storage, CMS structure)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Categories ───
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  image TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Products ───
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
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

-- ─── CMS tables ───
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cms_blocks (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  body TEXT DEFAULT '',
  image TEXT DEFAULT '',
  link TEXT DEFAULT '',
  cta TEXT DEFAULT '',
  tag TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_blocks_type ON cms_blocks(type);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- ─── Row Level Security ───
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
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_blocks ENABLE ROW LEVEL SECURITY;

-- Policies (safe create)
DROP POLICY IF EXISTS "public_read_categories" ON categories;
DROP POLICY IF EXISTS "public_read_products" ON products;
DROP POLICY IF EXISTS "public_read_coupons" ON coupons;
DROP POLICY IF EXISTS "public_insert_orders" ON orders;
DROP POLICY IF EXISTS "public_read_orders" ON orders;
DROP POLICY IF EXISTS "public_update_orders" ON orders;
DROP POLICY IF EXISTS "public_insert_order_items" ON order_items;
DROP POLICY IF EXISTS "public_read_order_items" ON order_items;
DROP POLICY IF EXISTS "public_insert_contact" ON contact_messages;
DROP POLICY IF EXISTS "public_read_contact" ON contact_messages;
DROP POLICY IF EXISTS "public_insert_custom" ON custom_cake_orders;
DROP POLICY IF EXISTS "public_read_custom" ON custom_cake_orders;
DROP POLICY IF EXISTS "public_insert_newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "public_upsert_profiles" ON customer_profiles;
DROP POLICY IF EXISTS "public_wishlist" ON wishlist;
DROP POLICY IF EXISTS "public_insert_reviews" ON reviews;
DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
DROP POLICY IF EXISTS "public_read_tracking" ON delivery_tracking;
DROP POLICY IF EXISTS "public_insert_tracking" ON delivery_tracking;
DROP POLICY IF EXISTS "admin_manage_products" ON products;
DROP POLICY IF EXISTS "admin_manage_categories" ON categories;
DROP POLICY IF EXISTS "admin_manage_coupons" ON coupons;
DROP POLICY IF EXISTS "admin_update_orders" ON orders;
DROP POLICY IF EXISTS "admin_update_custom" ON custom_cake_orders;
DROP POLICY IF EXISTS "admin_read_contact" ON contact_messages;
DROP POLICY IF EXISTS "admin_update_contact" ON contact_messages;
DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
DROP POLICY IF EXISTS "admin_manage_site_settings" ON site_settings;
DROP POLICY IF EXISTS "public_read_cms_blocks" ON cms_blocks;
DROP POLICY IF EXISTS "admin_manage_cms_blocks" ON cms_blocks;
DROP POLICY IF EXISTS "admin_read_reviews" ON reviews;
DROP POLICY IF EXISTS "admin_manage_reviews" ON reviews;
DROP POLICY IF EXISTS "admin_delete_reviews" ON reviews;
DROP POLICY IF EXISTS "admin_read_newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "admin_update_newsletter" ON newsletter_subscribers;

CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (true);
CREATE POLICY "public_read_products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "public_insert_orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_orders" ON orders FOR SELECT USING (true);
CREATE POLICY "public_update_orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "public_insert_contact" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_contact" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "public_insert_custom" ON custom_cake_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_custom" ON custom_cake_orders FOR SELECT USING (true);
CREATE POLICY "public_insert_newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "public_upsert_profiles" ON customer_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_wishlist" ON wishlist FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_insert_reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "public_read_tracking" ON delivery_tracking FOR SELECT USING (true);
CREATE POLICY "public_insert_tracking" ON delivery_tracking FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_manage_products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "admin_manage_categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "admin_manage_coupons" ON coupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "admin_update_custom" ON custom_cake_orders FOR UPDATE USING (true);
CREATE POLICY "admin_read_contact" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "admin_update_contact" ON contact_messages FOR UPDATE USING (true);
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "admin_manage_site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_read_cms_blocks" ON cms_blocks FOR SELECT USING (is_active = true);
CREATE POLICY "admin_manage_cms_blocks" ON cms_blocks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "admin_read_reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "admin_manage_reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "admin_delete_reviews" ON reviews FOR DELETE USING (true);
CREATE POLICY "admin_read_newsletter" ON newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "admin_update_newsletter" ON newsletter_subscribers FOR UPDATE USING (true);

-- ─── Image storage bucket ───
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
DROP POLICY IF EXISTS "public_upload_product_images" ON storage.objects;
DROP POLICY IF EXISTS "public_update_product_images" ON storage.objects;
DROP POLICY IF EXISTS "public_delete_product_images" ON storage.objects;

CREATE POLICY "public_read_product_images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "public_upload_product_images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "public_update_product_images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "public_delete_product_images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');

-- ═══════════════════════════════════════════════════════════════════════════
-- PART 2 — Client demo data (categories, products, homepage content)
-- Same as supabase_RUN_THIS.sql
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO categories (slug, name, image, sort_order) VALUES
  ('wedding',   'Wedding Cakes',   'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=80', 1),
  ('birthday',  'Birthday Cakes',  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80', 2),
  ('corporate', 'Corporate Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', 3),
  ('seasonal',  'Seasonal Cakes',  'https://images.unsplash.com/photo-1625866448531-1b00c0251f76?w=600&q=80', 4)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  image = EXCLUDED.image,
  sort_order = EXCLUDED.sort_order;

DELETE FROM products;

INSERT INTO products (category_id, name, description, price, image, stock, rating, reviews, popular, is_active)
SELECT c.id, v.name, v.description, v.price, v.image, v.stock, v.rating, v.reviews, v.popular, true
FROM (VALUES
  ('wedding',   'Rose Gold Elegance',    'Layers of vanilla sponge with rose-infused buttercream and edible gold leaf.', 450,  'https://images.unsplash.com/photo-1486427949362-c0aa028e0666?w=800&q=80', 10, 4.9, 24, 95),
  ('wedding',   'Pearl Wedding Tower',   'Five-tier masterpiece with pearl fondant and cascading sugar flowers.',       1200, 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80', 3,  5.0, 8,  100),
  ('wedding',   'White Garden Tier',     'Elegant three-tier cake with white chocolate ganache and fresh florals.',    680,  'https://images.unsplash.com/photo-1519676786029-4a5374a31f8?w=800&q=80',  6,  4.8, 15, 90),
  ('birthday',  'Midnight Chocolate',    'Rich dark chocolate ganache with Belgian cocoa and gold-dusted truffles.',    320,  'https://images.unsplash.com/photo-1606317138400-f2899e2919ee?w=800&q=80', 15, 4.8, 18, 88),
  ('birthday',  'Blush Berry Dream',     'Light sponge with mixed berry compote and mascarpone cream.',                 280,  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', 12, 4.7, 31, 82),
  ('birthday',  'Rainbow Celebration',   'Colorful funfetti layers with vanilla buttercream — perfect for kids.',      350,  'https://images.unsplash.com/photo-1558636508-e0db3819812a?w=800&q=80',  14, 4.9, 22, 91),
  ('corporate', 'Corporate Signature',   'Minimalist design for corporate events with optional logo printing.',         550,  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80', 8,  4.9, 12, 75),
  ('corporate', 'Logo Deluxe Cake',      'Premium corporate cake with edible logo and sleek modern finish.',            480,  'https://images.unsplash.com/photo-1571115764595-644a1f54a55?w=800&q=80',  10, 4.8, 9,  78),
  ('corporate', 'Executive Minimalist',  'Clean lines, neutral tones — ideal for boardroom celebrations.',            420,  'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80', 11, 4.7, 7,  72),
  ('seasonal',  'Ramadan Crescent',      'Seasonal creation with dates, pistachio, and rose water.',                    380,  'https://images.unsplash.com/photo-1625866448531-1b00c0251f76?w=800&q=80', 20, 5.0, 45, 98),
  ('seasonal',  'Eid Delight',           'Festive cake with saffron, cardamom sponge and honey glaze.',                 400,  'https://images.unsplash.com/photo-1587668178575-beb4e6c72572?w=800&q=80', 18, 4.9, 28, 96),
  ('seasonal',  'Winter Berry Noel',     'Spiced sponge with cranberry compote and cinnamon buttercream.',              360,  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', 16, 4.8, 19, 85)
) AS v(cat_slug, name, description, price, image, stock, rating, reviews, popular)
JOIN categories c ON c.slug = v.cat_slug;

INSERT INTO coupons (code, type, value, min_order, max_uses, expires_at, is_active) VALUES
  ('WELCOME10', 'percentage', 10, 100, 500, NOW() + INTERVAL '1 year', true),
  ('FLAT50',    'fixed',      50, 200, 200, NOW() + INTERVAL '6 months', true)
ON CONFLICT (code) DO UPDATE SET is_active = true;

INSERT INTO site_settings (key, value) VALUES
  ('brand_name', 'Maison Douceur'),
  ('tagline', 'Artisan Luxury Cakes'),
  ('phone', '+974 1234 5678'),
  ('email', 'hello@maisondouceur.qa'),
  ('address', 'West Bay, Doha, Qatar'),
  ('whatsapp', '97412345678'),
  ('whatsapp_message', 'Hello! I would like to order a cake from Maison Douceur.'),
  ('map_embed', 'https://maps.google.com/maps?q=West+Bay+Doha+Qatar&output=embed'),
  ('instagram_url', 'https://instagram.com'),
  ('facebook_url', 'https://facebook.com'),
  ('stat_orders', '5000'),
  ('stat_customers', '3200'),
  ('stat_years', '12'),
  ('about_title', 'Our Story'),
  ('about_subtitle', 'Crafted with Love Since 2012'),
  ('about_text', 'At Maison Douceur, we believe every celebration deserves a masterpiece.'),
  ('hero_title', 'Artisan Cakes for Every Celebration'),
  ('hero_subtitle', 'Handcrafted luxury cakes made with love in Doha, Qatar'),
  ('hero_images', '["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80","https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1920&q=80"]')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

DELETE FROM cms_blocks;

INSERT INTO cms_blocks (type, body, sort_order) VALUES
  ('announcement', '🎉 WELCOME10 — Get 10% off your first order!', 1),
  ('announcement', '🚚 Free delivery on orders above QAR 300', 2),
  ('announcement', '✨ Explore Wedding, Birthday, Corporate & Seasonal collections', 3);

INSERT INTO cms_blocks (type, title, subtitle, image, link, sort_order, meta) VALUES
  ('showcase', 'Wedding Cakes',     'Elegant tiers for your perfect day',     'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=80', 'shop?category=wedding',   1, '{"bg":"bg-[#FFF8E7]"}'),
  ('showcase', 'Birthday Cakes',    'Celebrate every age in style',           'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80', 'shop?category=birthday',  2, '{"bg":"bg-blush"}'),
  ('showcase', 'Corporate Cakes',   'Impress at every business event',      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', 'shop?category=corporate', 3, '{"bg":"bg-[#F0F4F8]"}'),
  ('showcase', 'Seasonal Cakes',    'Limited editions for special moments',   'https://images.unsplash.com/photo-1625866448531-1b00c0251f76?w=600&q=80', 'shop?category=seasonal',  4, '{"bg":"bg-[#FDF0E8]"}');

INSERT INTO cms_blocks (type, title, body, image, link, cta, sort_order, meta) VALUES
  ('split_section', 'Freshly baked and full of love!', 'Every wedding cake handcrafted with premium ingredients.', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80', 'shop?category=wedding', 'Show More', 1, '{"overlay_title":"Wedding Collection","overlay_cta":"Show Products","reversed":false}'),
  ('split_section', 'Birthdays made unforgettable!', 'Perfect birthday centrepieces for every age.', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', 'shop?category=birthday', 'Show More', 2, '{"overlay_title":"Birthday Collection","overlay_cta":"Show Products","reversed":true}'),
  ('split_section', 'Meetings are about to get sweet!', 'Corporate cakes with custom logos.', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80', 'shop?category=corporate', 'Show More', 3, '{"overlay_title":"Corporate Collection","overlay_cta":"Show Products","reversed":false}'),
  ('split_section', 'Seasonal flavours, limited time!', 'Ramadan, Eid, and holiday specials.', 'https://images.unsplash.com/photo-1625866448531-1b00c0251f76?w=800&q=80', 'shop?category=seasonal', 'Show More', 4, '{"overlay_title":"Seasonal Collection","overlay_cta":"Show Products","reversed":true}');

INSERT INTO cms_blocks (type, title, body, sort_order, meta) VALUES
  ('testimonial', 'Fatima Al-Thani', 'The wedding cake was absolutely stunning!', 1, '{"rating":5}'),
  ('testimonial', 'Sarah Mitchell', 'Maison Douceur exceeded all expectations.', 2, '{"rating":5}'),
  ('testimonial', 'Ahmed Hassan', 'Professional, elegant, and delicious corporate cake.', 3, '{"rating":5}'),
  ('testimonial', 'Layla Al-Kuwari', 'My daughter''s birthday cake was a dream come true!', 4, '{"rating":5}');

-- SUCCESS! Database is fully set up with demo data.
