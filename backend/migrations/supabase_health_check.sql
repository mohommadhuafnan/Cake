-- ═══════════════════════════════════════════════════════════════════════════
-- Quick health check — run in Supabase SQL Editor to verify your database
-- Each query should return rows without errors
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Categories (must have: id, slug, name, image)
SELECT id, slug, name, image, sort_order FROM categories ORDER BY sort_order;

-- 2. Products (must have category_id — NOT a "category" text column)
SELECT p.id, p.name, p.price, p.category_id, c.slug AS category_slug, p.image, p.is_active
FROM products p
LEFT JOIN categories c ON c.id = p.category_id
ORDER BY p.id;

-- 3. CMS tables exist
SELECT COUNT(*) AS settings_count FROM site_settings;
SELECT type, COUNT(*) AS block_count FROM cms_blocks GROUP BY type ORDER BY type;

-- 4. Coupons
SELECT code, type, value, is_active FROM coupons;

-- 5. Column check (should NOT list a "category" column on products)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'products'
ORDER BY ordinal_position;
