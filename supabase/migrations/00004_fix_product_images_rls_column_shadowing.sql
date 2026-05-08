-- TiendaLabs — Fix product-images Storage RLS column shadowing
-- Date: 2026-04-29
--
-- The policies created in 00003 referenced unqualified `name` inside a subquery
-- on `public.stores`. Postgres resolved that as `stores.name` (the store's
-- display name) instead of `storage.objects.name` (the upload path). Every
-- owner upload was denied by RLS regardless of who was authenticated.
--
-- Fix: rewrite both policies using EXISTS and qualify the path reference as
-- `storage.objects.name` so it cannot collide with `stores.name`.

DROP POLICY IF EXISTS "Owner can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Owner can delete product images" ON storage.objects;

CREATE POLICY "Owner can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1
      FROM public.stores
      WHERE owner_id = auth.uid()
        AND id::text = (storage.foldername(storage.objects.name))[2]
    )
  );

CREATE POLICY "Owner can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1
      FROM public.stores
      WHERE owner_id = auth.uid()
        AND id::text = (storage.foldername(storage.objects.name))[2]
    )
  );
