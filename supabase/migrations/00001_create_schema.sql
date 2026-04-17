-- TiendaLabs — Initial Schema
-- Creates: stores, products, orders tables with RLS enabled

-- =============================================================================
-- ENUM: payment_status
-- =============================================================================
create type public.payment_status as enum (
  'pending',
  'approved',
  'rejected',
  'refunded'
);

-- =============================================================================
-- TABLE: stores
-- =============================================================================
create table public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  domain text unique,

  branding jsonb not null default '{
    "primary_color": "#18181b",
    "secondary_color": "#f4f4f5",
    "accent_color": "#2563eb",
    "logo_url": null,
    "font_heading": "Geist",
    "font_body": "Geist"
  }'::jsonb,

  template_id text not null default 'bold',

  config jsonb not null default '{
    "mercadopago_access_token": null,
    "mercadopago_public_key": null,
    "contact_email": null,
    "contact_phone": null,
    "social_links": {
      "instagram": null,
      "facebook": null,
      "tiktok": null,
      "whatsapp": null
    },
    "conversion_features": {
      "urgency_timer": false,
      "social_proof": false,
      "trust_badges": true,
      "stock_counter": false
    }
  }'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for subdomain/domain resolution
create index idx_stores_slug on public.stores (slug);
create index idx_stores_domain on public.stores (domain) where domain is not null;

-- =============================================================================
-- TABLE: products
-- =============================================================================
create table public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  slug text not null,
  description text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  compare_at_price numeric(12, 2) check (compare_at_price is null or compare_at_price >= 0),
  images text[] not null default '{}',
  variants jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Unique slug per store
  unique (store_id, slug)
);

-- Index for storefront queries
create index idx_products_store_active on public.products (store_id, is_active, position);

-- =============================================================================
-- TABLE: orders
-- =============================================================================
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  items jsonb not null default '[]'::jsonb,
  total numeric(12, 2) not null check (total >= 0),
  payment_status public.payment_status not null default 'pending',
  payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for admin queries
create index idx_orders_store on public.orders (store_id, created_at desc);
create index idx_orders_payment_id on public.orders (payment_id) where payment_id is not null;

-- =============================================================================
-- TRIGGER: updated_at auto-refresh
-- =============================================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_stores_updated
  before update on public.stores
  for each row execute function public.handle_updated_at();

create trigger on_products_updated
  before update on public.products
  for each row execute function public.handle_updated_at();

create trigger on_orders_updated
  before update on public.orders
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- RLS: Enable on all tables
-- =============================================================================
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- For now, allow public read on stores and products (storefront needs this)
-- Admin write policies will be added when auth is implemented in Phase 2

-- Storefront: anyone can read active stores
create policy "Public can read stores"
  on public.stores for select
  using (true);

-- Storefront: anyone can read active products
create policy "Public can read active products"
  on public.products for select
  using (is_active = true);

-- Storefront: anyone can create orders (checkout)
create policy "Public can create orders"
  on public.orders for insert
  with check (true);

-- Storefront: anyone can read their own order by ID (for success page)
create policy "Public can read orders"
  on public.orders for select
  using (true);

-- =============================================================================
-- SEED: Demo store for development
-- =============================================================================
insert into public.stores (name, slug, template_id)
values ('Demo Store', 'demo', 'bold');

insert into public.products (store_id, name, slug, description, price, compare_at_price, images, position)
select
  s.id,
  'Zapatillas Runner Pro',
  'zapatillas-runner-pro',
  'Las zapatillas más cómodas para correr. Diseñadas con tecnología de amortiguación avanzada para máximo rendimiento.',
  49999.99,
  69999.99,
  array['https://placehold.co/800x800/18181b/ffffff?text=Runner+Pro'],
  0
from public.stores s
where s.slug = 'demo';

insert into public.products (store_id, name, slug, description, price, images, position)
select
  s.id,
  'Remera Dry-Fit Sport',
  'remera-dry-fit-sport',
  'Remera deportiva con tecnología Dry-Fit. Perfecta para entrenar con máxima comodidad.',
  15999.99,
  array['https://placehold.co/800x800/2563eb/ffffff?text=Dry-Fit'],
  1
from public.stores s
where s.slug = 'demo';

insert into public.products (store_id, name, slug, description, price, compare_at_price, images, position)
select
  s.id,
  'Mochila Urban 30L',
  'mochila-urban-30l',
  'Mochila urbana resistente al agua con compartimento para notebook de hasta 15 pulgadas.',
  34999.99,
  44999.99,
  array['https://placehold.co/800x800/059669/ffffff?text=Urban+30L'],
  2
from public.stores s
where s.slug = 'demo';
