-- Umami website_id for store2 (provisioned VPS 2026-10-01)

UPDATE public.tenants
SET theme_json = theme_json || '{
  "umami_website_id": "aff7de94-597b-41df-afc8-3d81fab4f609"
}'::jsonb,
    updated_at = now()
WHERE slug = 'store2';
