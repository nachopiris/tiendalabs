-- TiendaLabs — Add Store Ownership
-- Adds owner_id to stores (FK → auth.users) and access_token to orders (UUID).
-- Closes the public orders SELECT leak and installs 8 new RLS policies for
-- authenticated store owners (stores: 2, products: 4, orders: 2).
-- Demo store remains ownerless (owner_id = NULL).
-- Date: 2026-04-17

-- =============================================================================
-- SCHEMA: New columns
-- =============================================================================
ALTER TABLE stores ADD COLUMN owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN access_token uuid UNIQUE NOT NULL DEFAULT gen_random_uuid();

-- =============================================================================
-- DOCUMENTATION: Column comments
-- =============================================================================
COMMENT ON COLUMN stores.owner_id IS 'Owner of the store. NULL for platform-owned stores (e.g., demo). ON DELETE SET NULL preserves orphaned stores for recovery.';
COMMENT ON COLUMN orders.access_token IS 'Unique token for guest order tracking without authentication. Used by future /orden/[token] page and /api/orders/[token] route (service_role-backed).';

-- =============================================================================
-- INDEX: Accelerate owner-based subquery in products/orders RLS
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id);
-- Note: UNIQUE on orders.access_token creates an implicit btree index — no separate index needed.

-- =============================================================================
-- RLS: Drop public orders SELECT leak
-- =============================================================================
DROP POLICY IF EXISTS "Public can read orders" ON orders;

-- =============================================================================
-- RLS: Stores — owner write policies (2)
-- =============================================================================
CREATE POLICY "Owner can create store"
  ON stores FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owner can update their store"
  ON stores FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- =============================================================================
-- RLS: Products — owner CRUD policies (4, separate per command — no FOR ALL)
-- =============================================================================
CREATE POLICY "Owner can read all their products"
  ON products FOR SELECT
  TO authenticated
  USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));

CREATE POLICY "Owner can insert products to their stores"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));

CREATE POLICY "Owner can update their products"
  ON products FOR UPDATE
  TO authenticated
  USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()))
  WITH CHECK (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));

CREATE POLICY "Owner can delete their products"
  ON products FOR DELETE
  TO authenticated
  USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));

-- =============================================================================
-- RLS: Orders — owner read/update policies (2)
-- =============================================================================
CREATE POLICY "Owner can read their orders"
  ON orders FOR SELECT
  TO authenticated
  USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));

CREATE POLICY "Owner can update their orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()))
  WITH CHECK (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));

-- Policies KEPT untouched (not modified by this migration):
--   "Public can read stores"          (stores SELECT)
--   "Public can read active products" (products SELECT)
--   "Public can create orders"        (orders INSERT — checkout flow)
