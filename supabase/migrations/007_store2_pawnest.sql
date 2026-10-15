-- PawNest (store2): Forest & Amber theme copy + 7 pet category hero products (F4 copywriter)

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
    "typography": {
      "heading": "Fraunces",
      "body": "Source Sans 3"
    },
    "copy": {
      "tagline": "Akcesoria, które pasują do domu i do futrzaka",
      "footer": "© 2026 PawNest · store2.fighter132456.pl",
      "locale": "pl",
      "hero": {
        "eyebrow": "Sklep dla psów i kotów",
        "headline": "PawNest",
        "subheadline": "Akcesoria, które pasują do domu i do futrzaka — od spokojnych spacerów po wygodne drzemki.",
        "cta_primary": "Zobacz produkty",
        "cta_secondary": "Kategorie"
      },
      "about_short": "PawNest to sklep akcesoriów dla psów i kotów w estetyce Forest & Amber — naturalne kolory, proste kształty i produkty do codziennego życia z pupilem.",
      "contact_intro": "Masz pytanie o zamówienie, rozmiar lub dostępność? Napisz do zespołu PawNest — odpowiadamy po polsku w dni robocze.",
      "meta_home_title": "PawNest — akcesoria dla psów i kotów",
      "meta_home_description": "PawNest — obroże GPS, miski slow-feeder, legowiska, fontanny, półki dla kotów, szczotki i szelki LED. Wysyłka w Polsce i UE."
    },
    "categories": [
      {
        "slug": "gps",
        "nav_pl": "GPS i lokalizacja",
        "hero_title": "Obroże GPS — spokój na spacerze",
        "hero_teaser": "Lokalizacja i strefy bezpieczeństwa w aplikacji. Mniej stresu, gdy pies odkrywa nowe trasy.",
        "image_alt": "Obroża GPS dla psa — kategoria PawNest",
        "placeholder_url": "https://placehold.co/640x480/2D6A4F/F7F5F0?text=GPS"
      },
      {
        "slug": "slow-feeder",
        "nav_pl": "Miski slow-feeder",
        "hero_title": "Wolniejsze jedzenie, mniej pośpiechu",
        "hero_teaser": "Miseczki spowalniające jedzenie pomagają psom i kotom jeść spokojniej — także przy wrażliwym żołądku.",
        "image_alt": "Miska slow-feeder dla psa lub kota — PawNest",
        "placeholder_url": "https://placehold.co/640x480/1B4332/F7F5F0?text=Slow+feeder"
      },
      {
        "slug": "legowiska",
        "nav_pl": "Legowiska",
        "hero_title": "Miękkie miejsca na drzemki",
        "hero_teaser": "Legowiska z miękkim wypełnieniem i neutralnym designem — pasują do salonu i do psiego spania.",
        "image_alt": "Legowisko dla psa w stylu Forest & Amber — PawNest",
        "placeholder_url": "https://placehold.co/640x480/D4A373/1C1917?text=Legowisko"
      },
      {
        "slug": "fontanny",
        "nav_pl": "Fontanny",
        "hero_title": "Świeża woda, która zachęca do picia",
        "hero_teaser": "Fontanny z filtrem i cichą pompą — szczególnie dla kotów, które wolą płynącą wodę z miski.",
        "image_alt": "Fontanna dla kota lub psa — kategoria PawNest",
        "placeholder_url": "https://placehold.co/640x480/2D6A4F/F7F5F0?text=Fontanna"
      },
      {
        "slug": "polki",
        "nav_pl": "Półki i drapaki",
        "hero_title": "Półki ścienne dla kotów",
        "hero_teaser": "Półki i drapaki montowane na ścianie — więcej pionowej przestrzeni bez zajmowania podłogi.",
        "image_alt": "Półka ścienna dla kota z drapakiem — PawNest",
        "placeholder_url": "https://placehold.co/640x480/57534E/F7F5F0?text=Polki"
      },
      {
        "slug": "szczotki",
        "nav_pl": "Szczotki i pielęgnacja",
        "hero_title": "Mniej sierści na kanapie",
        "hero_teaser": "Szczotki do codziennego wyczesywania i sezonowego linienia — delikatne dla skóry, skuteczne na sierść.",
        "image_alt": "Szczotka do pielęgnacji psa lub kota — PawNest",
        "placeholder_url": "https://placehold.co/640x480/D4A373/1C1917?text=Szczotka"
      },
      {
        "slug": "szelki-led",
        "nav_pl": "Szelki LED",
        "hero_title": "Widoczność po zmroku",
        "hero_teaser": "Szelki z podświetleniem LED ułatwiają spacery wieczorem — Ty widzisz psa, pies widzi ścieżkę.",
        "image_alt": "Szelki LED dla psa na spacer nocą — PawNest",
        "placeholder_url": "https://placehold.co/640x480/1B4332/D4A373?text=LED"
      }
    ],
    "trust_strip": [
      { "id": "payments", "label": "Płatności Stripe", "detail": "Bezpieczna kasa w trybie testowym sklepu." },
      { "id": "returns", "label": "Zwrot 14 dni", "detail": "Prawo odstąpienia dla konsumentów w UE." },
      { "id": "shipping", "label": "Wysyłka PL i UE", "detail": "Szacunkowo 5–14 dni roboczych po płatności." },
      { "id": "support", "label": "Obsługa po polsku", "detail": "Pomoc mailowa w dni robocze." }
    ],
    "shipping": {
      "regions": [
        { "code": "PL", "label": "Polska", "days_min": 5, "days_max": 12, "note_pl": "Kurier / paczkomat wg dostępności CJ" },
        { "code": "EU", "label": "Unia Europejska", "days_min": 7, "days_max": 14, "note_pl": "Czas zależy od kraju docelowego" }
      ],
      "free_shipping_threshold_cents": null,
      "display_pl": "Wysyłka na terenie Polski i UE. Szacowany czas: 5–14 dni roboczych po płatności."
    },
    "support_email": "support-store2@fighter132456.pl",
    "legal_entity": {
      "business_name": "[DO UZUPEŁNIENIA: pełna nazwa przedsiębiorcy]",
      "address": "[DO UZUPEŁNIENIA: ulica, kod pocztowy, miasto, Polska]",
      "nip": "[DO UZUPEŁNIENIA: NIP]",
      "email": "support-store2@fighter132456.pl"
    },
    "umami_website_id": "aff7de94-597b-41df-afc8-3d81fab4f609"
  }'::jsonb,
  updated_at = now()
WHERE slug = 'store2';

INSERT INTO public.products (tenant_id, sku, title, description, price_cents, cj_product_id, images_json, active)
SELECT t.id, v.sku, v.title, v.description, v.price_cents, v.cj_product_id, v.images_json, true
FROM public.tenants t
CROSS JOIN (VALUES
  (
    'CJ-STORE2-001',
    'Obroża GPS dla psa — lokalizacja i strefy bezpieczeństwa',
    'Obroża GPS PawNest łączy moduł lokalizacyjny z wygodnym paskiem na szyję psa. W aplikacji ustawisz strefę bezpieczeństwa (geofence) i dostaniesz powiadomienie, gdy pupil wyjdzie poza wyznaczony obszar — przydatne na wypadach na działkę lub w nowym parku. Historia tras pomaga odtworzyć trasę spaceru, a tryb oszczędzania baterii wydłuża czas pracy między ładowaniami. Pasek regulowany, odpinany; przed zakupem zmierz obwód szyi i porównaj z tabelą rozmiarów na karcie produktu. Produkt wymaga aktywnej subskrypcji aplikacji u producenta — szczegóły i aktualne opłaty podajemy w opisie po podłączeniu katalogu CJ. Nie zastępuje nadzoru właściciela ani smyczy przepisowej w miejscach publicznych.',
    2499,
    'cj-pawnest-gps-001',
    '[{"url": "https://placehold.co/600x600/2D6A4F/F7F5F0?text=GPS", "alt": "Obroża GPS dla psa PawNest"}]'::jsonb
  ),
  (
    'CJ-STORE2-002',
    'Miska slow-feeder — spowalnia jedzenie',
    'Miska slow-feeder PawNest ma żebra i labirynt, które zmuszają psa lub kota do jedzenia wolniejszym tempem. Dzięki temu mniej połykania powietrza przy posiłku i spokojniejsze trawienie u zwierząt, które „żarły” kiedyś w kilka sekund. Wykonana z tworzywa bezpiecznego dla kontaktu z karmą, myta ręcznie lub w zmywarce (sprawdź symbol na spodzie). Stabilna podstawa ogranicza przesuwanie po podłodze. Wybierz rozmiar pod porcję dzienną — za mała miska utrudni komfort, za duża nie spowolni jedzenia. Idealna jako uzupełnienie rutyny karmienia, nie jako substytut porady weterynaryjnej przy poważnych problemach żołądkowych.',
    1999,
    'cj-pawnest-feeder-002',
    '[{"url": "https://placehold.co/600x600/1B4332/F7F5F0?text=Slow+feeder", "alt": "Miska slow-feeder PawNest"}]'::jsonb
  ),
  (
    'CJ-STORE2-003',
    'Legowisko dla psa — miękkie wypełnienie, kolor Forest',
    'Legowisko PawNest ma miękkie, sprężyste wypełnienie i obicie w odcieniu Forest, które dobrze wpisuje się w jasne wnętrza. Podwyższony brzeg daje pupilkowi oparcie dla głowy, a zdejmowany pokrowiec ułatwia pranie po spacerach w deszczu czy po sezonie linienia. Dostępne rozmiary od małych ras po średniego psa — zmierz długość od nosa do ogona w pozycji leżącej i dodaj kilka centymetrów na wygodne rozłożenie się. Legowisko sprawdza się w salonie i sypialni; przed pierwszym użyciem wypruj zgodnie z metką. To produkt komfortowy, nie ortopedyczny — przy bólu stawów skonsultuj wybór z weterynarzem.',
    3499,
    'cj-pawnest-bed-003',
    '[{"url": "https://placehold.co/600x600/D4A373/1C1917?text=Legowisko", "alt": "Legowisko dla psa PawNest Forest"}]'::jsonb
  ),
  (
    'CJ-STORE2-004',
    'Fontanna dla kota i psa — cicha pompa, filtr',
    'Fontanna wodna PawNest zachęca do picia dzięki delikatnemu strumieniowi wody. Cicha pompa nie powinna przeszkadzać w nocy, a wymienny filtr redukuje osad i smak chloru z kranu. Pojemność zbiornika wystarcza na kilka dni u jednego kota lub mniejszego psa — uzupełniaj wodę codziennie. Zestaw zawiera kable USB i instrukcję czyszczenia; regularne mycie zapobiega biofilmowi. Koty, które ignorują stojącą miskę, często chętniej piją z fontanny — obserwuj pupila przy pierwszym tygodniu i dostosuj przepływ, jeśli producent to przewiduje. Zawsze ustaw urządzenie na równej, stabilnej powierzchni z dala od przewodów do gryzienia.',
    2799,
    'cj-pawnest-fountain-004',
    '[{"url": "https://placehold.co/600x600/2D6A4F/F7F5F0?text=Fontanna", "alt": "Fontanna dla kota PawNest"}]'::jsonb
  ),
  (
    'CJ-STORE2-005',
    'Półka ścienna dla kota z drapakiem — zestaw 2 elementów',
    'Zestaw półek PawNest montuje się na ścianie, aby kot mógł wspinać się, odpoczywać z dala od psa i ostrzyć pazury na tym samym drapaku. Solidne mocowania (śruby/kołki w zestawie — typ zależy od wersji CJ) rozkładają obciążenie na kilka punktów; montaż wykonaj w murze lub konstrukcji zgodnie z instrukcją. Tkanina na półce jest łatwa do odkurzenia, a sizal na drapaku wymieniasz, gdy się zużyje. Zaplanuj trasę „kociych autostrad” między półką a meblami, żeby uniknąć skoków na niestabilne regały. Produkt dla kotów domowych; maksymalne obciążenie podaje producent na etykiecie — nie przekraczaj go przy większych rasach.',
    3299,
    'cj-pawnest-shelf-005',
    '[{"url": "https://placehold.co/600x600/57534E/F7F5F0?text=Polki", "alt": "Półka ścienna dla kota PawNest"}]'::jsonb
  ),
  (
    'CJ-STORE2-006',
    'Szczotka do wyczesywania — pies i kot, mniej sierści w domu',
    'Szczotka PawNest usuwa luźną sierść i delikatnie rozczesuje podszerstek u psów i kotów krótko- oraz średniowłosych. Ergonomiczna rękojeść ułatwia krótkie sesje codzienne zamiast jednego długiego wyczesywania w sezonie linienia. Stosuj łagodnie wokół uszu, brzucha i ogona — tam skóra bywa wrażliwsza. Po użyciu wyczyść zęby szczotki, aby przedłużyć jej żywotność. Regularna pielęgnacja ogranicza ilość włosów na kanapie i ubraniach, ale nie eliminuje linienia — to naturalny proces. Przy podrażnieniach skóry lub łupieżu skonsultuj się z weterynarzem zamiast intensywnie szczotkować.',
    2499,
    'cj-pawnest-brush-006',
    '[{"url": "https://placehold.co/600x600/D4A373/1C1917?text=Szczotka", "alt": "Szczotka do pielęgnacji PawNest"}]'::jsonb
  ),
  (
    'CJ-STORE2-007',
    'Szelki dla psa z LED — widoczność po zmroku',
    'Szelki PawNest z wbudowanym podświetleniem LED poprawiają widoczność psa na spacerach po zmroku, przy drodze i na osiedlowych alejkach. Regulowane pasy na klatce piersiowej rozłożą nacisk bezpieczniej niż smycz przypięta tylko do obroży — szczególnie u psów, które szarpną. Tryby świecenia (stały / pulsujący — zależnie od wersji) włączasz jednym przyciskiem; ładuj przez USB między spacerami. Przed pierwszym użyciem dopasuj szelki tak, aby wsunąć dwie palce między pas a ciało psa. LED nie zastępuje latarki właściciela ani smyczy przepisowej. Sprawdź rozmiar według obwodu klatki i długości grzbietu w tabeli producenta.',
    3299,
    'cj-pawnest-led-007',
    '[{"url": "https://placehold.co/600x600/1B4332/D4A373?text=LED", "alt": "Szelki LED dla psa PawNest"}]'::jsonb
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
