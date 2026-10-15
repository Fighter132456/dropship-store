-- PawNest (store2) — F4 tenant theme + 7 SKU (replaces S38 eco demo catalog)

UPDATE public.tenants
SET
  name = 'PawNest',
  theme_json = '{
    "logo": "/tenants/store2/logo.svg",
    "colors": {
      "primary": "#2D6A4F",
      "secondary": "#1B4332",
      "accent": "#D4A373",
      "background": "#F7F5F0",
      "text": "#1C1917",
      "muted": "#57534E"
    },
    "typography": { "heading": "Fraunces", "body": "Source Sans 3" },
    "copy": {
      "tagline": "Forest & Amber — spokojne akcesoria dla psów i kotów",
      "footer": "© 2026 PawNest. Wszelkie prawa zastrzeżone.",
      "locale": "pl-PL",
      "meta_home_title": "PawNest — akcesoria dla psów i kotów",
      "meta_home_description": "GPS, legowiska, fontanny, pielęgnacja i smart akcesoria — wysyłka PL i UE. 7 starannie wybranych produktów.",
      "hero": {
        "eyebrow": "FOREST & AMBER",
        "headline": "Dom, w którym czworonóg czuje się bezpiecznie",
        "subheadline": "PawNest — akcesoria dla psów i kotów: technologia, komfort i spokojny design.",
        "cta_primary": "Zobacz produkty",
        "cta_secondary": "Dowiedz się więcej"
      }
    },
    "categories": [
      { "slug": "gps", "nav_pl": "GPS", "hero_title": "Lokalizacja bez stresu", "hero_teaser": "Obroże i tagi GPS", "image_alt": "GPS dla psa", "placeholder_url": "https://placehold.co/600x400/2D6A4F/F7F5F0?text=GPS" },
      { "slug": "slow-feeder", "nav_pl": "Slow feeder", "hero_title": "Spokojne posiłki", "hero_teaser": "Miski spowalniające", "image_alt": "Slow feeder", "placeholder_url": "https://placehold.co/600x400/1B4332/F7F5F0?text=Slow+feeder" },
      { "slug": "legowiska", "nav_pl": "Legowiska", "hero_title": "Miękkie legowiska", "hero_teaser": "Komfort do drzemki", "image_alt": "Legowisko", "placeholder_url": "https://placehold.co/600x400/D4A373/1C1917?text=Legowisko" },
      { "slug": "fontanny", "nav_pl": "Fontanny", "hero_title": "Świeża woda", "hero_teaser": "Fontanny dla kotów i psów", "image_alt": "Fontanna", "placeholder_url": "https://placehold.co/600x400/2D6A4F/F7F5F0?text=Fontanna" },
      { "slug": "polki", "nav_pl": "Półki", "hero_title": "Półki na ścianę", "hero_teaser": "Dla kotów", "image_alt": "Półka", "placeholder_url": "https://placehold.co/600x400/1B4332/F7F5F0?text=Polka" },
      { "slug": "szczotki", "nav_pl": "Szczotki", "hero_title": "Pielęgnacja sierści", "hero_teaser": "Delikatne szczotki", "image_alt": "Szczotka", "placeholder_url": "https://placehold.co/600x400/D4A373/1C1917?text=Szczotka" },
      { "slug": "szelki-led", "nav_pl": "Szelki LED", "hero_title": "Bezpieczne spacery", "hero_teaser": "Szelki z LED", "image_alt": "Szelki LED", "placeholder_url": "https://placehold.co/600x400/2D6A4F/F7F5F0?text=Szelki+LED" }
    ],
    "trust_strip": [
      { "id": "ship", "label": "Wysyłka PL/UE", "detail": "5–14 dni roboczych" },
      { "id": "returns", "label": "Zwrot 14 dni", "detail": "Zgodnie z regulaminem" },
      { "id": "support", "label": "Wsparcie e-mail", "detail": "support-store2@fighter132456.pl" },
      { "id": "stripe", "label": "Płatność Stripe", "detail": "Bezpieczny checkout" }
    ],
    "umami_website_id": "aff7de94-597b-41df-afc8-3d81fab4f609"
  }'::jsonb,
  updated_at = now()
WHERE slug = 'store2';

UPDATE public.products SET active = false, updated_at = now()
WHERE tenant_id = (SELECT id FROM public.tenants WHERE slug = 'store2')
  AND sku LIKE 'CJ-STORE2-00%';

INSERT INTO public.products (tenant_id, sku, title, description, price_cents, cj_product_id, images_json, active)
SELECT t.id, v.sku, v.title, v.description, v.price_cents, v.cj_product_id, v.images_json, true
FROM public.tenants t
CROSS JOIN (VALUES
  ('CJ-STORE2-PN-001', 'Obroża GPS dla psa — PawNest Track', 'Lekka obroża GPS z aplikacją — monitoruj spacer i bezpieczną strefę.', 19900, 'cj-pn-gps-01', '[{"url": "https://placehold.co/600x600/2D6A4F/F7F5F0?text=GPS", "alt": "Obroża GPS PawNest"}]'::jsonb),
  ('CJ-STORE2-PN-002', 'Miska slow feeder — Forest', 'Spowalnia jedzenie — mniej wzdęć, spokojniejszy posiłek.', 8900, 'cj-pn-sf-01', '[{"url": "https://placehold.co/600x600/1B4332/F7F5F0?text=Slow+feeder", "alt": "Slow feeder PawNest"}]'::jsonb),
  ('CJ-STORE2-PN-003', 'Legowisko boucle — Amber Nest', 'Miękkie legowisko z poszewką boucle — idealne do salonu.', 14900, 'cj-pn-bed-01', '[{"url": "https://placehold.co/600x600/D4A373/1C1917?text=Legowisko", "alt": "Legowisko PawNest"}]'::jsonb),
  ('CJ-STORE2-PN-004', 'Fontanna dla kota 2,5 L', 'Cicha pompa, filtr węglowy — zachęca do picia wody.', 12900, 'cj-pn-fnt-01', '[{"url": "https://placehold.co/600x600/2D6A4F/F7F5F0?text=Fontanna", "alt": "Fontanna PawNest"}]'::jsonb),
  ('CJ-STORE2-PN-005', 'Półka ścienna dla kota — Forest Shelf', 'Mocowanie do ściany, filcowa podkładka — drapanie i odpoczynek.', 11900, 'cj-pn-sh-01', '[{"url": "https://placehold.co/600x600/1B4332/F7F5F0?text=Polka", "alt": "Półka PawNest"}]'::jsonb),
  ('CJ-STORE2-PN-006', 'Szczotka slicker — dual coat', 'Delikatne rozczesywanie podszerstwa u psów i kotów długowłosych.', 6900, 'cj-pn-br-01', '[{"url": "https://placehold.co/600x600/D4A373/1C1917?text=Szczotka", "alt": "Szczotka PawNest"}]'::jsonb),
  ('CJ-STORE2-PN-007', 'Szelki LED — SafeWalk', 'Odblask i LED dla wieczornych spacerów — regulowane.', 9900, 'cj-pn-led-01', '[{"url": "https://placehold.co/600x600/2D6A4F/F7F5F0?text=Szelki+LED", "alt": "Szelki LED PawNest"}]'::jsonb)
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
