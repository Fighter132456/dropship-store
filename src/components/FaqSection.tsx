import Link from "next/link";
import type { ReactNode } from "react";
import {
  getDeliveryFaqParagraph,
  getFaqIntro,
  getFaqItems,
  getTenantSupportEmail,
} from "@/lib/faq-content";
import { getSiteOrigin } from "@/lib/site-url";
import type { Tenant } from "@/types/store";

type FaqSectionProps = {
  tenant: Tenant;
};

function renderFaqAnswer(
  tenant: Tenant,
  id: string,
  primary: string,
  supportEmail: string,
): ReactNode {
  switch (id) {
    case "delivery":
      return <>{getDeliveryFaqParagraph(tenant)}</>;
    case "returns":
      if (tenant.slug === "store2") {
        return (
          <>
            Zasady odstąpienia i zwrotu opisuje{" "}
            <Link href="/refund-policy" className="font-medium underline underline-offset-2">
              polityka zwrotów
            </Link>
            . Przy produktach higienicznych lub montowanych na ścianie skontaktuj się z nami
            przed odesłaniem paczki — podpowiemy, co uwzględnić w zgłoszeniu.
          </>
        );
      }
      return (
        <>
          Szczegóły zwrotów, reklamacji i odstąpienia od umowy opisujemy w{" "}
          <Link href="/refund-policy" className="font-medium underline underline-offset-2">
            polityce zwrotów i reklamacji
          </Link>
          . Przed wysyłką zwrotu zapoznaj się z warunkami i skontaktuj się z nami, jeśli
          masz wątpliwości.
        </>
      );
    case "contact":
      if (tenant.slug === "store2" && tenant.theme_json.copy?.contact_intro) {
        return (
          <>
            {tenant.theme_json.copy.contact_intro}{" "}
            <a
              href={`mailto:${supportEmail}`}
              className="font-medium underline underline-offset-2"
              style={{ color: primary }}
            >
              {supportEmail}
            </a>
            . Odpowiadamy w dni robocze, zwykle w ciągu 1–2 dni.
          </>
        );
      }
      return (
        <>
          Napisz na{" "}
          <a
            href={`mailto:${supportEmail}`}
            className="font-medium underline underline-offset-2"
            style={{ color: primary }}
          >
            {supportEmail}
          </a>
          . Odpowiadamy w dni robocze, zwykle w ciągu 1–2 dni.
        </>
      );
    case "pet-sizing":
      return (
        <>
          Zmierz obwód szyi lub klatki piersiowej (szelki) oraz długość ciała w pozycji
          leżącej (legowisko) i porównaj z tabelą na karcie produktu. Zostaw miejsce na dwa
          palce między paskiem a skórą. W razie wątpliwości napisz do obsługi przed zakupem
          — podpowiemy na podstawie rasy i wagi.
        </>
      );
    case "terms":
      return (
        <>
          Obowiązują{" "}
          <Link href="/terms-of-service" className="font-medium underline underline-offset-2">
            regulamin sklepu
          </Link>
          . Zawiera on informacje o zamówieniach, płatnościach i odpowiedzialności
          sprzedawcy.
        </>
      );
    case "privacy":
      return (
        <>
          Zasady przetwarzania danych, w tym w celach realizacji zamówienia i analityki,
          opisuje{" "}
          <Link href="/privacy-policy" className="font-medium underline underline-offset-2">
            polityka prywatności
          </Link>
          .
        </>
      );
    default:
      return null;
  }
}

export async function FaqSection({ tenant }: FaqSectionProps) {
  const primary = tenant.theme_json.colors?.primary ?? "#2563eb";
  const supportEmail = getTenantSupportEmail(tenant);
  const siteOrigin = await getSiteOrigin(tenant);
  const items = getFaqItems(tenant, siteOrigin);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="mt-16 border-t border-slate-200 pt-12"
    >
      <div className="mb-8 max-w-2xl">
        <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-slate-900">
          Najczęściej zadawane pytania
        </h2>
        <p className="mt-2 text-slate-600">{getFaqIntro(tenant)}</p>
      </div>
      <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
        {items.map((item) => (
          <details key={item.id} className="group px-4 py-4 sm:px-6">
            <summary
              className="cursor-pointer list-none text-base font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden"
            >
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span
                  className="shrink-0 text-slate-400 transition group-open:rotate-180"
                  aria-hidden="true"
                >
                  ▾
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {renderFaqAnswer(tenant, item.id, primary, supportEmail)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
