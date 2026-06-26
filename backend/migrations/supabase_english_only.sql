-- Migrate existing Supabase DB to English-only columns
-- Run ONCE in Supabase SQL Editor if you already ran the old schema

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'name_en') THEN
    ALTER TABLE categories RENAME COLUMN name_en TO name;
  END IF;
END $$;

ALTER TABLE categories DROP COLUMN IF EXISTS name_ar;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'name_en') THEN
    ALTER TABLE products RENAME COLUMN name_en TO name;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'description_en') THEN
    ALTER TABLE products RENAME COLUMN description_en TO description;
  END IF;
END $$;

ALTER TABLE products DROP COLUMN IF EXISTS name_ar;
ALTER TABLE products DROP COLUMN IF EXISTS description_ar;
