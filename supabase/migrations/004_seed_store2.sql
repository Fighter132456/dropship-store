-- Seed tenant store2 + 5 CJ test products (S38 multi-tenant)

INSERT INTO public.tenants (slug, domain, name, theme_json, status)
VALUES (
  'store2',
  'store2.fighter132456.pl',
  'Store 2',
  '{
    "logo": "/logo.svg",
    "colors": {
      "primary": "#059669",
      "secondary": "#047857",
      "background": "#ecfdf5",
      "text": "#064e3b"
    },
    "copy": {
      "tagline": "Eco-friendly essentials — shipped across EU",
      "footer": "© 2026 Store 2. All rights reserved."
    }
  }'::jsonb,
  'active'
)
ON CONFLICT (slug) DO UPDATE SET
  domain = EXCLUDED.domain,
  name = EXCLUDED.name,
  theme_json = EXCLUDED.theme_json,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.products (tenant_id, sku, title, description, price_cents, cj_product_id, images_json, active)
SELECT t.id, v.sku, v.title, v.description, v.price_cents, v.cj_product_id, v.images_json, true
FROM public.tenants t
CROSS JOIN (VALUES
  (
    'CJ-STORE2-001',
    'Bamboo Cutlery Set',
    'Reusable bamboo fork, knife, spoon and chopsticks in cotton pouch.',
    2499,
    'cj-test-101',
    '[{"url": "https://placehold.co/600x600/059669/white?text=Cutlery", "alt": "Bamboo Cutlery Set"}]'::jsonb
  ),
  (
    'CJ-STORE2-002',
    'Organic Cotton Tote Bag',
    'Large reusable shopping bag, GOTS certified organic cotton.',
    1999,
    'cj-test-102',
    '[{"url": "https://placehold.co/600x600/047857/white?text=Tote", "alt": "Organic Cotton Tote"}]'::jsonb
  ),
  (
    'CJ-STORE2-003',
    'Stainless Steel Water Bottle',
    '750ml double-wall insulated bottle, BPA-free, leak-proof lid.',
    3499,
    'cj-test-103',
    '[{"url": "https://placehold.co/600x600/10b981/white?text=Bottle", "alt": "Water Bottle"}]'::jsonb
  ),
  (
    'CJ-STORE2-004',
    'Beeswax Food Wraps (3-pack)',
    'Natural beeswax wraps for sandwiches and leftovers. Washable, reusable.',
    2799,
    'cj-test-104',
    '[{"url": "https://placehold.co/600x600/065f46/white?text=Wraps", "alt": "Beeswax Wraps"}]'::jsonb
  ),
  (
    'CJ-STORE2-005',
    'Compostable Phone Case',
    'Plant-based biodegradable case, fits most popular phone models.',
    3299,
    'cj-test-105',
    '[{"url": "https://placehold.co/600x600/34d399/white?text=Case", "alt": "Compostable Phone Case"}]'::jsonb
  )
) AS v(sku, title, description, price_cents, cj_product_id, images_json)
WHERE t.slug = 'store2'
ON CONFLICT (tenant_id, sku) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  cj_product_id = EXCLUDED.cj_product_id,
  images_json = EXCLUDED.images_json,
  active = EXCLUDED.active,
  updated_at = now();
