-- TiendaLabs — Product Storage Setup
-- NOTE: The UNIQUE constraint on products(store_id, slug) already exists in migration 00001.
-- This migration only sets up the product-images Storage bucket and its RLS policies.
-- Date: 2026-04-27

-- =============================================================================
-- STORAGE: bucket product-images (public)
-- =============================================================================
-- Insert the bucket if it doesn't already exist.
-- Public = true because product images are rendered on the public storefront;
-- signed URLs would break CDN caching and add per-image round-trips.
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- STORAGE RLS: objects on bucket product-images
-- Path structure: products/{store_id}/{uuid}/{filename}
-- (storage.foldername(name))[2] extracts store_id (Postgres arrays are 1-based;
-- foldername splits on '/' yielding ['products', '{store_id}', '{uuid}'])
-- =============================================================================

-- Owner INSERT: authenticated user must own the store referenced in the path
CREATE POLICY "Owner can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND auth.uid() IN (
      SELECT owner_id
      FROM public.stores
      WHERE id::text = (storage.foldername(name))[2]
    )
  );

-- Owner DELETE: same ownership check (required for future cleanup jobs)
CREATE POLICY "Owner can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND auth.uid() IN (
      SELECT owner_id
      FROM public.stores
      WHERE id::text = (storage.foldername(name))[2]
    )
  );

-- Public SELECT: product images are publicly accessible (storefront rendering)
CREATE POLICY "Public can read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');
