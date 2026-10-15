/**
 * PawNest (store2) marketing copy — Forest & Amber.
 * Consumed by homepage/collection UI; product bodies live in Supabase seed/migration.
 */

export const PAWNEST_ASSETS = {
  logo: "/tenants/store2/logo.svg",
  logoMark: "/tenants/store2/logo-mark.svg",
  heroBanner: "/tenants/store2/hero-banner.svg",
  categoryIconPath: (slug: string) => `/tenants/store2/icons/${slug}.svg`,
} as const;

export type PawNestCategoryCopy = {
  slug: string;
  nav_pl: string;
  hero_title: string;
  hero_teaser: string;
  image_alt: string;
  placeholder_path: string;
};

export const PAWNEST_HERO = {
  eyebrow: "Sklep dla psów i kotów",
  headline: "PawNest",
  subheadline:
    "Akcesoria, które pasują do domu i do futrzaka — od spokojnych spacerów po wygodne drzemki.",
  cta_primary: "Zobacz produkty",
  cta_secondary: "Kategorie",
} as const;

export const PAWNEST_TRUST_STRIP = [
  { id: "payments", label: "Płatności Stripe", detail: "Bezpieczna kasa w trybie testowym sklepu." },
  { id: "returns", label: "Zwrot 14 dni", detail: "Prawo odstąpienia dla konsumentów w UE." },
  { id: "shipping", label: "Wysyłka PL i UE", detail: "Szacunkowo 5–14 dni roboczych po płatności." },
  { id: "support", label: "Obsługa po polsku", detail: "Pomoc mailowa w dni robocze." },
] as const;

export const PAWNEST_CATEGORIES: PawNestCategoryCopy[] = [
  {
    slug: "gps",
    nav_pl: "GPS i lokalizacja",
    hero_title: "Obroże GPS — spokój na spacerze",
    hero_teaser:
      "Lokalizacja i strefy bezpieczeństwa w aplikacji. Mniej stresu, gdy pies odkrywa nowe trasy.",
    image_alt: "Obroża GPS dla psa — kategoria PawNest",
    placeholder_path: "https://placehold.co/640x480/2D6A4F/F7F5F0?text=GPS",
  },
  {
    slug: "slow-feeder",
    nav_pl: "Miski slow-feeder",
    hero_title: "Wolniejsze jedzenie, mniej pośpiechu",
    hero_teaser:
      "Miseczki spowalniające jedzenie pomagają psom i kotom jeść spokojniej — także przy wrażliwym żołądku.",
    image_alt: "Miska slow-feeder dla psa lub kota — PawNest",
    placeholder_path: "https://placehold.co/640x480/1B4332/F7F5F0?text=Slow+feeder",
  },
  {
    slug: "legowiska",
    nav_pl: "Legowiska",
    hero_title: "Miękkie miejsca na drzemki",
    hero_teaser:
      "Legowiska z miękkim wypełnieniem i neutralnym designem — pasują do salonu i do psiego spania.",
    image_alt: "Legowisko dla psa w stylu Forest & Amber — PawNest",
    placeholder_path: "https://placehold.co/640x480/D4A373/1C1917?text=Legowisko",
  },
  {
    slug: "fontanny",
    nav_pl: "Fontanny",
    hero_title: "Świeża woda, która zachęca do picia",
    hero_teaser:
      "Fontanny z filtrem i cichą pompą — szczególnie dla kotów, które wolą płynącą wodę z miski.",
    image_alt: "Fontanna dla kota lub psa — kategoria PawNest",
    placeholder_path: "https://placehold.co/640x480/2D6A4F/F7F5F0?text=Fontanna",
  },
  {
    slug: "polki",
    nav_pl: "Półki i drapaki",
    hero_title: "Półki ścienne dla kotów",
    hero_teaser:
      "Półki i drapaki montowane na ścianie — więcej pionowej przestrzeni bez zajmowania podłogi.",
    image_alt: "Półka ścienna dla kota z drapakiem — PawNest",
    placeholder_path: "https://placehold.co/640x480/57534E/F7F5F0?text=Polki",
  },
  {
    slug: "szczotki",
    nav_pl: "Szczotki i pielęgnacja",
    hero_title: "Mniej sierści na kanapie",
    hero_teaser:
      "Szczotki do codziennego wyczesywania i sezonowego linienia — delikatne dla skóry, skuteczne na sierść.",
    image_alt: "Szczotka do pielęgnacji psa lub kota — PawNest",
    placeholder_path: "https://placehold.co/640x480/D4A373/1C1917?text=Szczotka",
  },
  {
    slug: "szelki-led",
    nav_pl: "Szelki LED",
    hero_title: "Widoczność po zmroku",
    hero_teaser:
      "Szelki z podświetleniem LED ułatwiają spacery wieczorem — Ty widzisz psa, pies widzi ścieżkę.",
    image_alt: "Szelki LED dla psa na spacer nocą — PawNest",
    placeholder_path: "https://placehold.co/640x480/1B4332/D4A373?text=LED",
  },
];

export const PAWNEST_HOME_FAQ_INTRO =
  "Krótkie odpowiedzi o dostawie, zwrotach i akcesoriach dla zwierząt. Pełne informacje prawne znajdziesz w linkowanych dokumentach.";

export const PAWNEST_ABOUT_BLURB =
  "PawNest to sklep akcesoriów dla psów i kotów w estetyce Forest & Amber — naturalne kolory, proste kształty i produkty do codziennego życia z pupilem. Nie jesteśmy weterynarzami; przy kwestiach zdrowotnych zawsze skonsultuj się ze specjalistą.";

export const PAWNEST_CONTACT_INTRO =
  "Masz pytanie o zamówienie, rozmiar lub dostępność? Napisz do zespołu PawNest — odpowiadamy po polsku w dni robocze.";
