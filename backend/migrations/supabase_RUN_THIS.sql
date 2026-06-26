-- ═══════════════════════════════════════════════════════════════════════════
-- Maison Douceur — RUN THIS IN SUPABASE SQL EDITOR (ONE FILE ONLY)
-- DO NOT run old supabase.sql that uses name_en / name_ar — it will FAIL!
-- Supabase Dashboard → SQL Editor → New query → paste ALL → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Fix categories: ensure `name` column exists ───
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'categories' AND column_name = 'name'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'categories' AND column_name = 'name_en'
    ) THEN
      ALTER TABLE categories RENAME COLUMN name_en TO name;
    ELSIF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'categories' AND column_name = 'name_ar'
    ) THEN
      ALTER TABLE categories RENAME COLUMN name_ar TO name;
    ELSE
      ALTER TABLE categories ADD COLUMN name TEXT NOT NULL DEFAULT '';
      UPDATE categories SET name = INITCAP(REPLACE(slug, '-', ' ')) WHERE name = '' OR name IS NULL;
    END IF;
  END IF;
END $$;

ALTER TABLE categories DROP COLUMN IF EXISTS name_ar;
ALTER TABLE categories DROP COLUMN IF EXISTS name_en;

-- ─── 2. Fix products: ensure `name` and `description` columns exist ───
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'name'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'name_en'
    ) THEN
      ALTER TABLE products RENAME COLUMN name_en TO name;
    ELSE
      ALTER TABLE products ADD COLUMN name TEXT NOT NULL DEFAULT 'Cake';
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'description'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'description_en'
    ) THEN
      ALTER TABLE products RENAME COLUMN description_en TO description;
    ELSE
      ALTER TABLE products ADD COLUMN description TEXT DEFAULT '';
    END IF;
  END IF;
END $$;

ALTER TABLE products DROP COLUMN IF EXISTS name_ar;
ALTER TABLE products DROP COLUMN IF EXISTS name_en;
ALTER TABLE products DROP COLUMN IF EXISTS description_ar;
ALTER TABLE products DROP COLUMN IF EXISTS description_en;

-- ─── 3. Create CMS tables (site_settings + cms_blocks) ───
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
CREATE INDEX IF NOT EXISTS idx_cms_blocks_sort ON cms_blocks(type, sort_order);

-- ─── 4. RLS for CMS tables ───
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
DROP POLICY IF EXISTS "admin_manage_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "admin_manage_site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_cms_blocks" ON cms_blocks;
DROP POLICY IF EXISTS "admin_manage_cms_blocks" ON cms_blocks;
CREATE POLICY "public_read_cms_blocks" ON cms_blocks FOR SELECT USING (is_active = true);
CREATE POLICY "admin_manage_cms_blocks" ON cms_blocks FOR ALL USING (true) WITH CHECK (true);

-- Reviews & newsletter admin policies (safe re-run)
DROP POLICY IF EXISTS "admin_read_reviews" ON reviews;
DROP POLICY IF EXISTS "admin_manage_reviews" ON reviews;
DROP POLICY IF EXISTS "admin_delete_reviews" ON reviews;
CREATE POLICY "admin_read_reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "admin_manage_reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "admin_delete_reviews" ON reviews FOR DELETE USING (true);

DROP POLICY IF EXISTS "admin_read_newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "admin_update_newsletter" ON newsletter_subscribers;
CREATE POLICY "admin_read_newsletter" ON newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "admin_update_newsletter" ON newsletter_subscribers FOR UPDATE USING (true);

-- ═══ CLIENT DEMO DATA (categories, products, homepage) ═══

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
  ('instagram_url', 'https://instagram.com'),
  ('facebook_url', 'https://facebook.com'),
  ('hero_title', 'Artisan Cakes for Every Celebration'),
  ('hero_subtitle', 'Handcrafted luxury cakes made with love in Doha, Qatar')
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

-- SUCCESS! Refresh https://cake-jade-two.vercel.app/admin
