-- RPC helpers: set_tenant + query in single transaction (PostgREST session fix)

CREATE OR REPLACE FUNCTION public.get_products_for_tenant(tenant_uuid uuid)
RETURNS SETOF public.products
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, app
AS $$
BEGIN
  PERFORM app.set_tenant(tenant_uuid);
  RETURN QUERY
    SELECT * FROM public.products
    WHERE tenant_id = tenant_uuid AND active = true
    ORDER BY created_at ASC;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_product_for_tenant(tenant_uuid uuid, product_uuid uuid)
RETURNS public.products
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, app
AS $$
DECLARE
  result public.products;
BEGIN
  PERFORM app.set_tenant(tenant_uuid);
  SELECT * INTO result FROM public.products
  WHERE id = product_uuid AND tenant_id = tenant_uuid AND active = true;
  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_products_for_tenant(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_product_for_tenant(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_products_for_tenant(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_product_for_tenant(uuid, uuid) TO anon, authenticated, service_role;
