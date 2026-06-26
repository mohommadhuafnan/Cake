-- ═══════════════════════════════════════════════════════════════════════════
-- Maison Douceur — FULL CLIENT DEMO SAMPLE
-- Run in Supabase → SQL Editor (after supabase_fix_all.sql if needed)
-- Fills categories, products, homepage content, coupons for client presentation
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Categories with images (same as website shop links) ───
INSERT INTO categories (slug, name, image, sort_order) VALUES
  ('wedding',   'Wedding Cakes',   'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=80', 1),
  ('birthday',  'Birthday Cakes',  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80', 2),
  ('corporate', 'Corporate Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', 3),
  ('seasonal',  'Seasonal Cakes',  'https://images.unsplash.com/photo-1625866448531-1b00c0251f76?w=600&q=80', 4)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  image = EXCLUDED.image,
  sort_order = EXCLUDED.sort_order;

-- ─── 2. Demo products (3 per category = 12 cakes) ───
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

-- ─── 3. Coupons ───
INSERT INTO coupons (code, type, value, min_order, max_uses, expires_at, is_active) VALUES
  ('WELCOME10', 'percentage', 10, 100, 500, NOW() + INTERVAL '1 year', true),
  ('FLAT50',    'fixed',      50, 200, 200, NOW() + INTERVAL '6 months', true)
ON CONFLICT (code) DO UPDATE SET is_active = true;

-- ─── 4. Site settings (client-ready contact & social) ───
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
  ('twitter_url', 'https://twitter.com'),
  ('stat_orders', '5000'),
  ('stat_customers', '3200'),
  ('stat_years', '12'),
  ('about_title', 'Our Story'),
  ('about_subtitle', 'Crafted with Love Since 2012'),
  ('about_text', 'At Maison Douceur, we believe every celebration deserves a masterpiece. Our artisan bakers combine French patisserie techniques with premium ingredients to create cakes that are as beautiful as they are delicious.'),
  ('about_extra', 'Our master patissiers bring decades of experience from Paris, Milan, and Dubai, combining European techniques with Middle Eastern flavors.'),
  ('about_image', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80'),
  ('about_values', '[{"title":"Quality","desc":"Only the finest ingredients, sourced ethically from around the world."},{"title":"Craftsmanship","desc":"Every cake is handcrafted with meticulous attention to detail."},{"title":"Passion","desc":"We pour our hearts into every creation, making your moments unforgettable."}]'),
  ('hero_title', 'Artisan Cakes for Every Celebration'),
  ('hero_subtitle', 'Handcrafted luxury cakes made with love in Doha, Qatar'),
  ('hero_images', '["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80","https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1920&q=80","https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=1920&q=80","https://images.unsplash.com/photo-1606890737304-57a1aa8aef7e?w=1920&q=80"]'),
  ('home_about_image', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80'),
  ('section_signature_title', 'Signature Gateau Cakes'),
  ('section_signature_subtitle', 'Elevate your celebrations with our signature wedding creations.'),
  ('section_top_selling_title', 'Top-Selling Products'),
  ('section_top_selling_subtitle', 'Our customers'' most loved cakes — order yours today.'),
  ('section_delight_title', 'Cakes of Delight'),
  ('section_delight_subtitle', 'Freshly baked birthday and seasonal delights for every craving.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- ─── 5. Homepage CMS content (linked to same categories) ───
DELETE FROM cms_blocks;

INSERT INTO cms_blocks (type, body, sort_order) VALUES
  ('announcement', '🎉 WELCOME10 — Get 10% off your first order!', 1),
  ('announcement', '🚚 Free delivery on orders above QAR 300', 2),
  ('announcement', '✨ Explore Wedding, Birthday, Corporate & Seasonal collections', 3);

INSERT INTO cms_blocks (type, title, subtitle, image, link, sort_order, meta) VALUES
  ('showcase', 'Wedding Cakes',     'Elegant tiers for your perfect day',       'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=80', 'shop?category=wedding',   1, '{"bg":"bg-[#FFF8E7]"}'),
  ('showcase', 'Birthday Cakes',    'Celebrate every age in style',             'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80', 'shop?category=birthday',  2, '{"bg":"bg-blush"}'),
  ('showcase', 'Corporate Cakes',   'Impress at every business event',        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', 'shop?category=corporate', 3, '{"bg":"bg-[#F0F4F8]"}'),
  ('showcase', 'Seasonal Cakes',    'Limited editions for special moments',     'https://images.unsplash.com/photo-1625866448531-1b00c0251f76?w=600&q=80', 'shop?category=seasonal',  4, '{"bg":"bg-[#FDF0E8]"}');

INSERT INTO cms_blocks (type, tag, title, body, image, cta, link, sort_order, meta) VALUES
  ('hero_slide', 'Wedding',    'Rose Gold Elegance',  'Layers of vanilla sponge with rose-infused buttercream.',     'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80', 'Order Now', 'shop?category=wedding',   1, '{}'),
  ('hero_slide', 'Seasonal',   'Ramadan Crescent',    'Dates, pistachio, and rose water — a celebration of tradition.', 'https://images.unsplash.com/photo-1587668178575-beb4e6c72572?w=1920&q=80', 'Order Now', 'shop?category=seasonal', 2, '{}'),
  ('hero_slide', 'Birthday',   'Rainbow Celebration', 'Colorful funfetti layers perfect for every birthday party.',  'https://images.unsplash.com/photo-1558636508-e0db3819812a?w=1920&q=80', 'Order Now', 'shop?category=birthday',  3, '{}');

INSERT INTO cms_blocks (type, title, image, link, cta, sort_order, meta) VALUES
  ('special_offer', 'Create Your Own Cake',  'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&q=80', 'custom', 'Design Now', 1, '{"bg":"from-[#E8F4FD] to-[#D4E9F7]"}'),
  ('special_offer', 'Wedding Collection',    'https://images.unsplash.com/photo-1486427949362-c0aa028e0666?w=500&q=80', 'shop?category=wedding', 'Shop Now', 2, '{"bg":"from-blush to-[#F5D5DA]"}'),
  ('special_offer', 'Corporate Orders',      'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80', 'shop?category=corporate', 'Shop Now', 3, '{"bg":"from-[#F0E6FA] to-[#E2D4F0]"}');

INSERT INTO cms_blocks (type, title, subtitle, image, link, cta, sort_order) VALUES
  ('promo_banner', 'Our Best Sellers',           'Delightful assortment across all categories',  'https://images.unsplash.com/photo-1606312615240-497af8f638e0?w=1920&q=80', 'shop', 'Shop Now', 1),
  ('promo_banner', 'Savor Freshly Baked Cakes',  'Baked daily with premium ingredients',         'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1920&q=80', 'shop', 'Shop Now', 2);

INSERT INTO cms_blocks (type, title, body, image, link, cta, sort_order, meta) VALUES
  ('split_section', 'Freshly baked and full of love!',
   'Every Maison Douceur wedding cake is handcrafted with premium ingredients — from Belgian chocolate to organic vanilla — baked fresh daily in our Doha kitchen.',
   'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80', 'shop?category=wedding', 'Show More', 1,
   '{"overlay_title":"Wedding Collection","overlay_cta":"Show Products","reversed":false}'),
  ('split_section', 'Birthdays made unforgettable!',
   'From kids'' rainbow cakes to elegant adult celebrations — find the perfect birthday centrepiece for every age.',
   'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', 'shop?category=birthday', 'Show More', 2,
   '{"overlay_title":"Birthday Collection","overlay_cta":"Show Products","reversed":true}'),
  ('split_section', 'Meetings are about to get sweet!',
   'Impress clients and celebrate teams with our corporate collection — elegant designs, custom logos, and flavors everyone will remember.',
   'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80', 'shop?category=corporate', 'Show More', 3,
   '{"overlay_title":"Corporate Collection","overlay_cta":"Show Products","reversed":false}'),
  ('split_section', 'Seasonal flavours, limited time!',
   'Ramadan, Eid, and holiday specials crafted with traditional Middle Eastern ingredients and modern flair.',
   'https://images.unsplash.com/photo-1625866448531-1b00c0251f76?w=800&q=80', 'shop?category=seasonal', 'Show More', 4,
   '{"overlay_title":"Seasonal Collection","overlay_cta":"Show Products","reversed":true}');

INSERT INTO cms_blocks (type, title, body, sort_order, meta) VALUES
  ('testimonial', 'Fatima Al-Thani',  'The wedding cake was absolutely stunning. Every guest asked where we ordered it from!', 1, '{"rating":5}'),
  ('testimonial', 'Sarah Mitchell',   'Maison Douceur exceeded all expectations. The attention to detail is unmatched in Qatar.', 2, '{"rating":5}'),
  ('testimonial', 'Ahmed Hassan',     'Ordered a custom corporate cake for our event. Professional, elegant, and delicious.', 3, '{"rating":5}'),
  ('testimonial', 'Layla Al-Kuwari',  'My daughter''s birthday cake was a dream come true. She cried happy tears!', 4, '{"rating":5}');

-- ✅ Done! Your client demo is ready.
-- Visit: Home page, Shop (click category images), Admin panel
