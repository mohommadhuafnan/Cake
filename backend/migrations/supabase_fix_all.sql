-- ═══════════════════════════════════════════════════════════════════════════
-- Maison Douceur — FIX ALL ADMIN ERRORS
-- Run this ENTIRE file once in: Supabase Dashboard → SQL Editor → Run
-- Fixes:
--   1. "Could not find table site_settings / cms_blocks"
--   2. "column categories_1.name does not exist"
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

-- ─── 5. Seed site_settings (only if empty) ───
INSERT INTO site_settings (key, value) VALUES
  ('brand_name', 'Maison Douceur'),
  ('tagline', 'Artisan Luxury Cakes'),
  ('phone', '+974 1234 5678'),
  ('email', 'hello@maisondouceur.qa'),
  ('address', 'West Bay, Doha, Qatar'),
  ('whatsapp', '97412345678'),
  ('whatsapp_message', 'Hello! I would like to order a cake from Maison Douceur.'),
  ('map_embed', 'https://maps.google.com/maps?q=Doha+Qatar&output=embed'),
  ('stat_orders', '5000'),
  ('stat_customers', '3200'),
  ('stat_years', '12'),
  ('about_title', 'Our Story'),
  ('about_subtitle', 'Crafted with Love Since 2012'),
  ('about_text', 'At Maison Douceur, we believe every celebration deserves a masterpiece.'),
  ('about_extra', 'Our master patissiers bring decades of experience from Paris, Milan, and Dubai.'),
  ('about_image', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80'),
  ('about_values', '[{"title":"Quality","desc":"Only the finest ingredients."},{"title":"Craftsmanship","desc":"Every cake is handcrafted."},{"title":"Passion","desc":"We pour our hearts into every creation."}]'),
  ('hero_title', 'Artisan Cakes for Every Celebration'),
  ('hero_subtitle', 'Handcrafted luxury cakes made with love in Doha, Qatar'),
  ('hero_images', '["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80","https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1920&q=80"]'),
  ('home_about_image', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80'),
  ('section_signature_title', 'Signature Gateau Cakes'),
  ('section_signature_subtitle', 'Elevate your celebrations with our signature creations.'),
  ('section_top_selling_title', 'Top-Selling Products'),
  ('section_top_selling_subtitle', 'Our customers'' most loved cakes.'),
  ('section_delight_title', 'Cakes of Delight'),
  ('section_delight_subtitle', 'Freshly baked delights for every sweet craving.')
ON CONFLICT (key) DO NOTHING;

-- ─── 6. Seed cms_blocks (only if empty) ───
INSERT INTO cms_blocks (type, body, sort_order)
SELECT v.type, v.body, v.sort_order
FROM (VALUES
  ('announcement', '🎉 WELCOME10 — Get 10% off your first order!', 1),
  ('announcement', '🚚 Free delivery on orders above QAR 300', 2),
  ('announcement', '✨ Ramadan Collection now available — Order today!', 3)
) AS v(type, body, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM cms_blocks LIMIT 1);

INSERT INTO cms_blocks (type, tag, title, body, image, cta, link, sort_order, meta)
SELECT v.type, v.tag, v.title, v.body, v.image, v.cta, v.link, v.sort_order, v.meta::jsonb
FROM (VALUES
  ('hero_slide', 'New Arrival', 'Rose Gold Elegance', 'Layers of vanilla sponge with rose-infused buttercream.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80', 'Order Now', 'product/1', 1, '{"product_id":1}'),
  ('split_section', '', 'Freshly baked and full of love!', 'Every Maison Douceur cake is handcrafted with premium ingredients.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', 'Show More', 'shop?category=wedding', 1, '{"overlay_title":"Signature Wedding Cakes","overlay_cta":"Show Products","reversed":false}'),
  ('split_section', '', 'Meetings are about to get sweet!', 'Impress clients with our corporate cake collection.', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80', 'Show More', 'shop?category=corporate', 2, '{"overlay_title":"Corporate Collection","overlay_cta":"Show Products","reversed":true}')
) AS v(type, tag, title, body, image, cta, link, sort_order, meta)
WHERE (SELECT COUNT(*) FROM cms_blocks WHERE type IN ('hero_slide', 'split_section')) = 0;

-- Done! Refresh admin panel after running this script.
-- For full client demo sample, also run: backend/migrations/supabase_client_demo.sql
