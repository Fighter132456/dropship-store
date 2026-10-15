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

export function getFaqItems(tenant: Tenant, siteOrigin: string): FaqItemContent[] {
  const supportEmail = getTenantSupportEmail(tenant);

  return [
    {
      id: "delivery",
      question: "Jak długo trwa dostawa?",
      schemaAnswer:
        "Standardowa wysyłka na teren Polski i UE zwykle trwa 7–14 dni roboczych od potwierdzenia płatności. Dokładny termin zależy od magazynu i przewoźnika — numer śledzenia otrzymasz e-mailem po nadaniu paczki.",
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
