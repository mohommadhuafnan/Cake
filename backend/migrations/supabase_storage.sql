-- Create product-images storage bucket (run if uploads fail)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY IF NOT EXISTS "public_read_product_images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY IF NOT EXISTS "public_upload_product_images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');
