import type { Tenant } from "@/types/store";

export type FaqItemContent = {
  id: string;
  question: string;
  /** Plain text for FAQPage JSON-LD; must match visible FAQ copy. */
  schemaAnswer: string;
};

export function getTenantSupportEmail(tenant: Tenant): string {
  return tenant.theme_json.support_email ?? `support-${tenant.slug}@fighter132456.pl`;
}

function refundPolicyUrl(siteOrigin: string): string {
  return `${siteOrigin}/refund-policy`;
}

function termsUrl(siteOrigin: string): string {
  return `${siteOrigin}/terms-of-service`;
}

function privacyUrl(siteOrigin: string): string {
  return `${siteOrigin}/privacy-policy`;
}

function deliverySchemaAnswer(tenant: Tenant): string {
  const display =
    tenant.theme_json.shipping?.display_pl ??
    "Standardowa wysyłka na teren Polski i UE zwykle trwa 7–14 dni roboczych od potwierdzenia płatności.";
  return `${display} Dokładny termin zależy od magazynu i przewoźnika — numer śledzenia otrzymasz e-mailem po nadaniu paczki.`;
}

function defaultFaqItems(tenant: Tenant, siteOrigin: string): FaqItemContent[] {
  const supportEmail = getTenantSupportEmail(tenant);

  return [
    {
      id: "delivery",
      question: "Jak długo trwa dostawa?",
      schemaAnswer: deliverySchemaAnswer(tenant),
    },
    {
      id: "returns",
      question: "Jak mogę zwrócić produkt lub odstąpić od umowy?",
      schemaAnswer: `Szczegóły zwrotów, reklamacji i odstąpienia od umowy opisujemy w polityce zwrotów i reklamacji (${refundPolicyUrl(siteOrigin)}). Przed wysyłką zwrotu zapoznaj się z warunkami i skontaktuj się z nami, jeśli masz wątpliwości.`,
    },
    {
      id: "contact",
      question: "Jak skontaktować się z obsługą sklepu?",
      schemaAnswer: `Napisz na ${supportEmail}. Odpowiadamy w dni robocze, zwykle w ciągu 1–2 dni.`,
    },
    {
      id: "terms",
      question: "Na jakich warunkach kupuję w tym sklepie?",
      schemaAnswer: `Obowiązują regulamin sklepu (${termsUrl(siteOrigin)}). Zawiera on informacje o zamówieniach, płatnościach i odpowiedzialności sprzedawcy.`,
    },
    {
      id: "privacy",
      question: "Jak chronione są moje dane osobowe?",
      schemaAnswer: `Zasady przetwarzania danych, w tym w celach realizacji zamówienia i analityki, opisuje polityka prywatności (${privacyUrl(siteOrigin)}).`,
    },
  ];
}

function pawnestFaqItems(tenant: Tenant, siteOrigin: string): FaqItemContent[] {
  const supportEmail = getTenantSupportEmail(tenant);

  return [
    {
      id: "delivery",
      question: "Jak długo trwa dostawa PawNest?",
      schemaAnswer: deliverySchemaAnswer(tenant),
    },
    {
      id: "returns",
      question: "Jak zwrócić akcesorium dla pupila?",
      schemaAnswer: `Zasady odstąpienia i zwrotu opisuje polityka zwrotów (${refundPolicyUrl(siteOrigin)}). Przy produktach higienicznych lub montowanych na ścianie skontaktuj się z nami przed odesłaniem paczki — podpowiemy, co uwzględnić w zgłoszeniu.`,
    },
    {
      id: "contact",
      question: "Jak napisać do obsługi PawNest?",
      schemaAnswer: `${tenant.theme_json.copy?.contact_intro ?? "Napisz na " + supportEmail + "."} Adres: ${supportEmail}. Odpowiadamy w dni robocze, zwykle w ciągu 1–2 dni.`,
    },
    {
      id: "pet-sizing",
      question: "Jak dobrać rozmiar obroży, szelki lub legowiska?",
      schemaAnswer:
        "Zmierz obwód szyi lub klatki piersiowej (szelki) oraz długość ciała w pozycji leżącej (legowisko) i porównaj z tabelą na karcie produktu. Zostaw miejsce na dwa palce między paskiem a skórą. W razie wątpliwości napisz do obsługi przed zakupem — podpowiemy na podstawie rasy i wagi.",
    },
  ];
}

export function getFaqIntro(tenant: Tenant): string {
  if (tenant.slug === "store2") {
    return "Krótkie odpowiedzi o dostawie, zwrotach i akcesoriach dla zwierząt. Pełne informacje prawne znajdziesz w linkowanych dokumentach.";
  }
  return "Krótkie odpowiedzi o dostawie, zwrotach i kontakcie. Pełne informacje prawne znajdziesz w linkowanych dokumentach.";
}

export function getFaqItems(tenant: Tenant, siteOrigin: string): FaqItemContent[] {
  if (tenant.slug === "store2") {
    return pawnestFaqItems(tenant, siteOrigin);
  }
  return defaultFaqItems(tenant, siteOrigin);
}

export function getDeliveryFaqParagraph(tenant: Tenant): string {
  const display =
    tenant.theme_json.shipping?.display_pl ??
    "Standardowa wysyłka na teren Polski i UE zwykle trwa 7–14 dni roboczych od potwierdzenia płatności.";
  return `${display} Dokładny termin zależy od magazynu i przewoźnika — numer śledzenia otrzymasz e-mailem po nadaniu paczki.`;
}
