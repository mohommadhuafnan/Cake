-- ═══════════════════════════════════════════════════════════════════════════
-- Maison Douceur — CMS / Site Content Schema
-- Run in Supabase SQL Editor (after main supabase.sql)
-- ═══════════════════════════════════════════════════════════════════════════

-- Key-value site settings (brand, contact, stats, about page, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flexible content blocks for home page, testimonials, etc.
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

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "admin_manage_site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "public_read_cms_blocks" ON cms_blocks FOR SELECT USING (is_active = true);
CREATE POLICY "admin_manage_cms_blocks" ON cms_blocks FOR ALL USING (true) WITH CHECK (true);

-- Admin read/write for reviews & newsletter
CREATE POLICY "admin_read_reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "admin_manage_reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "admin_delete_reviews" ON reviews FOR DELETE USING (true);

CREATE POLICY "admin_read_newsletter" ON newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "admin_update_newsletter" ON newsletter_subscribers FOR UPDATE USING (true);

-- ─── Seed default settings ───
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

-- ─── Seed CMS blocks ───
INSERT INTO cms_blocks (type, body, sort_order) VALUES
  ('announcement', '🎉 WELCOME10 — Get 10% off your first order!', 1),
  ('announcement', '🚚 Free delivery on orders above QAR 300', 2),
  ('announcement', '✨ Ramadan Collection now available — Order today!', 3)
ON CONFLICT DO NOTHING;

INSERT INTO cms_blocks (type, tag, title, body, image, cta, link, sort_order, meta) VALUES
  ('hero_slide', 'New Arrival', 'Rose Gold Elegance', 'Layers of vanilla sponge with rose-infused buttercream.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80', 'Order Now', 'product/1', 1, '{"product_id":1}'),
  ('hero_slide', 'Best Seller', 'Ramadan Crescent', 'Seasonal creation with dates, pistachio, and rose water.', 'https://images.unsplash.com/photo-1587668178575-beb4e6c72572?w=1920&q=80', 'Order Now', 'product/5', 2, '{"product_id":5}'),
  ('hero_slide', 'Limited Edition', 'Pearl Wedding Tower', 'Five-tier masterpiece with pearl fondant.', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=1920&q=80', 'Order Now', 'product/6', 3, '{"product_id":6}')
ON CONFLICT DO NOTHING;

INSERT INTO cms_blocks (type, title, subtitle, image, link, sort_order, meta) VALUES
  ('showcase', 'Signature Cakes', 'Our finest handcrafted masterpieces', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', 'shop?category=wedding', 1, '{"bg":"bg-[#FFF8E7]"}'),
  ('showcase', 'Celebration Cakes', 'Perfect for every special moment', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80', 'shop?category=birthday', 2, '{"bg":"bg-blush"}'),
  ('showcase', 'Cake Slices & Bites', 'Indulgent portions, same luxury taste', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80', 'shop', 3, '{"bg":"bg-[#FDF0E8]"}')
ON CONFLICT DO NOTHING;

INSERT INTO cms_blocks (type, title, image, link, cta, sort_order, meta) VALUES
  ('special_offer', 'Create Your Own Cake', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&q=80', 'custom', 'Shop Now', 1, '{"bg":"from-[#E8F4FD] to-[#D4E9F7]"}'),
  ('special_offer', 'Photo Cake', 'https://images.unsplash.com/photo-1571115764595-644a1f54a55?w=500&q=80', 'custom', 'Shop Now', 2, '{"bg":"from-blush to-[#F5D5DA]"}'),
  ('special_offer', 'Dream Shape Cake', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80', 'custom', 'Shop Now', 3, '{"bg":"from-[#F0E6FA] to-[#E2D4F0]"}')
ON CONFLICT DO NOTHING;

INSERT INTO cms_blocks (type, title, subtitle, image, link, cta, sort_order) VALUES
  ('promo_banner', 'Our Best Sellers', 'Delightful assortment of artisan cakes', 'https://images.unsplash.com/photo-1606312615240-497af8f638e0?w=1920&q=80', 'shop', 'Shop Now', 1),
  ('promo_banner', 'Savor Freshly Baked Cakes', 'Baked daily with premium ingredients', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1920&q=80', 'shop', 'Shop Now', 2)
ON CONFLICT DO NOTHING;

INSERT INTO cms_blocks (type, title, body, image, link, cta, sort_order, meta) VALUES
  ('split_section', 'Freshly baked and full of love!', 'Every Maison Douceur cake is handcrafted with premium ingredients — baked fresh daily in Doha.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', 'shop?category=wedding', 'Show More', 1, '{"overlay_title":"Signature Wedding Cakes","overlay_cta":"Show Products","reversed":false}'),
  ('split_section', 'Meetings are about to get sweet!', 'Impress clients with our corporate cake collection — elegant designs and custom logos.', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80', 'shop?category=corporate', 'Show More', 2, '{"overlay_title":"Corporate Collection","overlay_cta":"Show Products","reversed":true}')
ON CONFLICT DO NOTHING;

INSERT INTO cms_blocks (type, title, body, sort_order, meta) VALUES
  ('testimonial', 'Fatima Al-Thani', 'The wedding cake was absolutely stunning. Every guest asked where we ordered it from!', 1, '{"rating":5}'),
  ('testimonial', 'Sarah Mitchell', 'Maison Douceur exceeded all expectations. The attention to detail is unmatched in Qatar.', 2, '{"rating":5}'),
  ('testimonial', 'Ahmed Hassan', 'Ordered a custom corporate cake for our event. Professional, elegant, and delicious.', 3, '{"rating":5}'),
  ('testimonial', 'Layla Al-Kuwari', 'My daughter''s birthday cake was a dream come true. She cried happy tears!', 4, '{"rating":5}')
ON CONFLICT DO NOTHING;
