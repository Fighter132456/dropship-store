-- Multi-tenant dropship store schema (S36 MVP)
-- Applied to Supabase project: stores (ref: ugzpgkxdemcthsmetvon)

CREATE SCHEMA IF NOT EXISTS app;

CREATE OR REPLACE FUNCTION app.set_tenant(tenant_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM set_config('app.tenant_id', tenant_uuid::text, true);
END;
$$;

CREATE OR REPLACE FUNCTION app.current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.tenant_id', true), '')::uuid;
$$;

REVOKE ALL ON FUNCTION app.set_tenant(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.set_tenant(uuid) TO anon, authenticated, service_role;

CREATE TABLE public.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  domain text NOT NULL UNIQUE,
  name text NOT NULL,
  stripe_account_id text,
  cj_store_id text,
  theme_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX tenants_domain_idx ON public.tenants (domain);
CREATE INDEX tenants_slug_idx ON public.tenants (slug);

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  sku text NOT NULL,
  title text NOT NULL,
  description text,
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  cj_product_id text,
  images_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, sku)
);

CREATE INDEX products_tenant_id_idx ON public.products (tenant_id);
CREATE INDEX products_tenant_active_idx ON public.products (tenant_id, active);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  stripe_session_id text UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded')),
  total_cents integer NOT NULL CHECK (total_cents >= 0),
  customer_email text,
  shipping_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX orders_tenant_id_idx ON public.orders (tenant_id);
CREATE INDEX orders_stripe_session_id_idx ON public.orders (stripe_session_id);

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  qty integer NOT NULL CHECK (qty > 0),
  unit_price_cents integer NOT NULL CHECK (unit_price_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX order_items_order_id_idx ON public.order_items (order_id);

CREATE TABLE public.cj_sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  sku text NOT NULL,
  cj_product_id text,
  synced_at timestamptz NOT NULL DEFAULT now(),
  payload_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX cj_sync_log_tenant_id_idx ON public.cj_sync_log (tenant_id);
CREATE INDEX cj_sync_log_tenant_sku_idx ON public.cj_sync_log (tenant_id, sku);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER tenants_updated_at BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cj_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenants_public_read ON public.tenants
  FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY products_tenant_read ON public.products
  FOR SELECT TO anon, authenticated
  USING (tenant_id = app.current_tenant_id() AND active = true);

CREATE POLICY orders_tenant_read ON public.orders
  FOR SELECT TO anon, authenticated
  USING (tenant_id = app.current_tenant_id());

CREATE POLICY order_items_tenant_read ON public.order_items
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND o.tenant_id = app.current_tenant_id()
    )
  );

CREATE POLICY cj_sync_log_tenant_read ON public.cj_sync_log
  FOR SELECT TO anon, authenticated
  USING (tenant_id = app.current_tenant_id());

CREATE OR REPLACE FUNCTION public.set_tenant(tenant_uuid uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, app
AS $$
  SELECT app.set_tenant(tenant_uuid);
$$;

REVOKE ALL ON FUNCTION public.set_tenant(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_tenant(uuid) TO anon, authenticated, service_role;
