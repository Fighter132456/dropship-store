-- Per-tenant analytics + support contact in theme_json (S39 free tier)

UPDATE public.tenants
SET theme_json = theme_json || '{
  "umami_website_id": "6ce159dc-88eb-49e8-bcba-7d15934a3760",
  "support_email": "support-store1@fighter132456.pl"
}'::jsonb,
    updated_at = now()
WHERE slug = 'store1';

UPDATE public.tenants
SET theme_json = theme_json || '{
  "support_email": "support-store2@fighter132456.pl"
}'::jsonb,
    updated_at = now()
WHERE slug = 'store2';
