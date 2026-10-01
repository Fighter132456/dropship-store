-- Seed tenant store1 + 5 CJ test products (S36 MVP)

INSERT INTO public.tenants (slug, domain, name, theme_json, status)
VALUES (
  'store1',
  'store1.fighter132456.pl',
  'Store 1',
  '{
    "logo": "/logo.svg",
    "colors": {
      "primary": "#2563eb",
      "secondary": "#1e40af",
      "background": "#f8fafc",
      "text": "#0f172a"
    },
    "copy": {
      "tagline": "Quality dropship products, fast EU shipping",
      "footer": "© 2026 Store 1. All rights reserved."
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
    'CJ-STORE1-001',
    'Wireless Earbuds Pro',
    'Premium TWS earbuds with active noise cancellation and 24h battery life.',
    8999,
    'cj-test-001',
    '[{"url": "https://placehold.co/600x600/2563eb/white?text=Earbuds", "alt": "Wireless Earbuds Pro"}]'::jsonb
  ),
  (
    'CJ-STORE1-002',
    'Smart Watch Fitness Tracker',
    'Heart rate, sleep tracking, and 7-day battery. IP68 waterproof.',
    12999,
    'cj-test-002',
    '[{"url": "https://placehold.co/600x600/1e40af/white?text=Watch", "alt": "Smart Watch"}]'::jsonb
  ),
  (
    'CJ-STORE1-003',
    'Portable Phone Charger 20000mAh',
    'Fast-charge power bank with USB-C PD 20W output.',
    4999,
    'cj-test-003',
    '[{"url": "https://placehold.co/600x600/059669/white?text=Charger", "alt": "Power Bank"}]'::jsonb
  ),
  (
    'CJ-STORE1-004',
    'LED Desk Lamp with USB Port',
    'Adjustable brightness, touch control, built-in USB charging port.',
    3999,
    'cj-test-004',
    '[{"url": "https://placehold.co/600x600/d97706/white?text=Lamp", "alt": "Desk Lamp"}]'::jsonb
  ),
  (
    'CJ-STORE1-005',
    'Bamboo Phone Stand Holder',
    'Eco-friendly bamboo stand for desk and bedside. Fits all phones.',
    2999,
    'cj-test-005',
    '[{"url": "https://placehold.co/600x600/7c3aed/white?text=Stand", "alt": "Phone Stand"}]'::jsonb
  )
) AS v(sku, title, description, price_cents, cj_product_id, images_json)
WHERE t.slug = 'store1'
ON CONFLICT (tenant_id, sku) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  cj_product_id = EXCLUDED.cj_product_id,
  images_json = EXCLUDED.images_json,
  active = EXCLUDED.active,
  updated_at = now();
