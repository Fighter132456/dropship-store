import type { Tenant } from "@/types/store";

type LegalSection = {
  title: string;
  body: string;
};

const LEGAL_PLACEHOLDER = "[DO UZUPEŁNIENIA PRZED PUBLIKACJĄ]";

export function isPolishLegal(tenant: Tenant): boolean {
  return tenant.theme_json.copy?.locale === "pl" || tenant.slug === "store2";
}

function supportEmail(tenant: Tenant): string {
  return tenant.theme_json.support_email ?? `support-${tenant.slug}@fighter132456.pl`;
}

type ResolvedLegalEntity = {
  businessName: string;
  address: string;
  nip: string;
  regon: string | null;
  email: string;
};

function legalEntity(tenant: Tenant): ResolvedLegalEntity {
  const raw = tenant.theme_json.legal_entity;
  return {
    businessName: raw?.business_name ?? LEGAL_PLACEHOLDER,
    address: raw?.address ?? LEGAL_PLACEHOLDER,
    nip: raw?.nip ?? LEGAL_PLACEHOLDER,
    regon: raw?.regon ?? null,
    email: raw?.email ?? supportEmail(tenant),
  };
}

function privacySectionsPl(tenant: Tenant): LegalSection[] {
  const email = supportEmail(tenant);
  const entity = legalEntity(tenant);
  return [
    {
      title: "Administrator danych",
      body: `${entity.businessName} (${tenant.name}) prowadzi sklep internetowy pod adresem ${tenant.domain}. W sprawach ochrony danych osobowych: ${email}. Dane identyfikacyjne sprzedawcy: sekcja Dane sprzedawcy na stronie /impressum.`,
    },
    {
      title: "Jakie dane zbieramy",
      body:
        "Dane zamówienia: imię i nazwisko lub nazwa firmy, adres dostawy, e-mail, zakupione produkty i kwoty — przekazywane podczas Stripe Checkout. " +
        "Techniczne identyfikatory sesji: pliki cookie tenant-id i tenant-slug (rozpoznanie sklepu w architekturze wielodostępnej), cookie-consent (zapis Twojej decyzji o plikach cookie), oraz niezbędne cookie sesji Stripe przy płatności. " +
        "Anonimowa statystyka odwiedzin (Umami, skrypt bez plików reklamowych i bez profilowania), gdy jest włączona — zagregowane liczniki odsłon. " +
        "Nie sprzedajemy danych osobowych i nie prowadzimy reklam behawioralnych w tym sklepie.",
    },
    {
      title: "Podstawy prawne (RODO / UE)",
      body:
        "Art. 6 ust. 1 lit. b RODO — wykonanie umowy sprzedaży i obsługa zamówienia. " +
        "Art. 6 ust. 1 lit. f RODO — prawnie uzasadniony interes: bezpieczeństwo sklepu, zapobieganie nadużyciom, prowadzenie niezbędnych logów technicznych oraz cookieless analityki, o ile ma zastosowanie. " +
        "Art. 6 ust. 1 lit. a RODO — zgoda, gdy wybierzesz opcję wykraczającą poza ściśle niezbędne pliki cookie (patrz polityka cookies).",
    },
    {
      title: "Okres przechowywania",
      body:
        "Dane zamówień i korespondencji obsługi klienta przechowujemy przez okres wymagany przepisami podatkowymi i rachunkowymi oraz do upływu terminów przedawnienia roszczeń. " +
        "Możesz żądać dostępu, sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz wnieść sprzeciw — w granicach RODO. Napisz na adres kontaktowy powyżej.",
    },
    {
      title: "Odbiorcy i podmioty przetwarzające",
      body:
        "Stripe, Inc. (płatności — możliwy transfer poza EOG z zabezpieczeniami umownymi), Supabase (baza zamówień), Vercel (hosting aplikacji), CJ Dropshipping lub równoważny partner fulfillmentu (realizacja wysyłki po podłączeniu produkcji). " +
        "Dane przetwarzamy głównie w UE; u dostawców infrastruktury obowiązują ich standardowe klauzule ochrony danych.",
    },
    {
      title: "Prawa i skargi",
      body: `Masz prawo złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa), jeśli uznasz, że przetwarzanie narusza przepisy. W pierwszej kolejności prosimy o kontakt: ${email}.`,
    },
  ];
}

function privacySectionsEn(tenant: Tenant): LegalSection[] {
  const email = supportEmail(tenant);
  return [
    {
      title: "Data controller",
      body: `${tenant.name} operates this storefront at ${tenant.domain}. Contact: ${email}.`,
    },
    {
      title: "What we collect",
      body: "Order data (email, shipping address, items purchased) via Stripe Checkout. Essential cookies for cart and tenant routing. Anonymous page analytics (Umami, cookieless script) may run on each visit when configured — aggregated counts, no ad profiling or sale of personal data.",
    },
    {
      title: "Legal basis (EU)",
      body: "Contract performance for orders; legitimate interest for security, fraud prevention, and cookieless analytics where applicable; consent where we use non-essential cookies beyond what is strictly necessary.",
    },
    {
      title: "Retention",
      body: "Order records are kept as required for accounting and support. You may request access or deletion via the contact email above.",
    },
    {
      title: "Processors",
      body: "Stripe (payments), Supabase (data storage), Vercel (hosting), CJ Dropshipping (fulfillment when live). Data processed in EU where possible.",
    },
  ];
}

export function privacySections(tenant: Tenant): LegalSection[] {
  return isPolishLegal(tenant) ? privacySectionsPl(tenant) : privacySectionsEn(tenant);
}

function termsSectionsPl(tenant: Tenant): LegalSection[] {
  const email = supportEmail(tenant);
  const entity = legalEntity(tenant);
  const shippingNote =
    tenant.theme_json.shipping?.display_pl ??
    "Czas dostawy zależy od regionu i przewoźnika — orientacyjnie podajemy go przy składaniu zamówienia.";
  return [
    {
      title: "Sprzedawca i umowa",
      body:
        `Sprzedawcą jest ${entity.businessName}, dane kontaktowe i identyfikacyjne: /impressum oraz ${email}. ` +
        `Korzystając z ${tenant.domain}, akceptujesz niniejszy regulamin. ${tenant.name} oferuje akcesoria dla psów i kotów przez sklep internetowy; umowa sprzedaży zawierana jest na odległość w rozumieniu przepisów o prawach konsumenta.`,
    },
    {
      title: "Zamówienia, ceny i płatności",
      body:
        "Ceny produktów, koszt dostawy i łączna kwota do zapłaty są widoczne w Stripe Checkout przed potwierdzeniem płatności. Płatności obsługuje Stripe. " +
        "W fazie testowej sklepu płatności mogą działać w trybie testowym Stripe — bez rzeczywistego obciążenia karty, zgodnie z komunikatem w kasie. " +
        "Zastrzegamy anulowanie zamówień w przypadku oczywistych błędów cenowych, braku towaru u dostawcy lub podejrzenia nadużycia.",
    },
    {
      title: "Realizacja i wysyłka (dropshipping)",
      body:
        `${shippingNote} Zamówienia realizujemy za pośrednictwem partnera fulfillmentu (np. CJ Dropshipping); przesyłka może być wysłana bezpośrednio z magazynu dostawcy. ` +
        "Numer śledzenia przekażemy e-mailem, gdy będzie dostępny. Ryzyko przypadkowej utraty lub uszkodzenia towaru w transporcie przechodzi na konsumenta z chwilą wydania przesyłki przewoźnikowi, z zastrzężeniem bezwzględnie obowiązujących przepisów.",
    },
    {
      title: "Produkty dla zwierząt",
      body:
        "Akcesoria (GPS, miski, legowiska, fontanny, półki, szczotki, szelki itd.) należy używać zgodnie z instrukcją producenta i nadzorem właściciela zwierzęcia. " +
        "Urządzenia GPS lub aplikacje producenta mogą wymagać osobnej subskrypcji lub opłat — informujemy o tym w opisie produktu, gdy dane są znane. " +
        "Produkty nie zastępują weterynaryjnej porady ani obowiązku trzymania psa na smyczy tam, gdzie tak stanowią przepisy.",
    },
    {
      title: "Reklamacje i odstąpienie",
      body:
        `Prawo odstąpienia od umowy w 14 dni oraz zasady zwrotów opisuje polityka na /refund-policy. Reklamacje wad i niezgodności z umową zgłaszaj na ${email} z numerem zamówienia i opisem problemu.`,
    },
    {
      title: "Ograniczenie odpowiedzialności",
      body:
        "W granicach dopuszczalnych przez prawo odpowiedzialność ograniczamy do wartości danego zamówienia. Postanowienia nie ograniczają praw konsumenta wynikających z bezwzględnie obowiązujących przepisów.",
    },
    {
      title: "Kontakt",
      body: `Pytania dotyczące zamówień i regulaminu: ${email}.`,
    },
  ];
}

function termsSectionsEn(tenant: Tenant): LegalSection[] {
  const email = supportEmail(tenant);
  return [
    {
      title: "Agreement",
      body: `By using ${tenant.domain} you agree to these terms. ${tenant.name} sells products via this online store.`,
    },
    {
      title: "Orders & payment",
      body: "Prices are shown at checkout. Payment is processed by Stripe. We reserve the right to cancel orders affected by stock or pricing errors.",
    },
    {
      title: "Shipping",
      body: "Delivery times and regions are shown at checkout. Risk passes on delivery to the address you provide.",
    },
    {
      title: "Limitation",
      body: "To the extent permitted by law, liability is limited to the order value. Nothing limits rights under mandatory consumer law.",
    },
    {
      title: "Contact",
      body: `Questions: ${email}.`,
    },
  ];
}

export function termsSections(tenant: Tenant): LegalSection[] {
  return isPolishLegal(tenant) ? termsSectionsPl(tenant) : termsSectionsEn(tenant);
}

function refundSectionsPl(tenant: Tenant): LegalSection[] {
  const email = supportEmail(tenant);
  const entity = legalEntity(tenant);
  return [
    {
      title: "Prawo odstąpienia (14 dni, UE)",
      body:
        "Konsument może odstąpić od umowy sprzedaży na odległość bez podania przyczyny w terminie 14 dni od dnia objęcia towaru w posiadanie (lub ostatniej części w przypadku dostawy partiami). " +
        "Termin liczony jest od dnia, w którym Ty lub wskazana przez Ciebie osoba trzecia (inna niż przewoźnik) weszła w posiadanie towaru.",
    },
    {
      title: "Wyjątki od odstąpienia",
      body:
        "Prawo odstąpienia nie przysługuje m.in. w przypadkach przewidzianych w art. 38 ustawy o prawach konsumenta, w tym: towarów zapieczętowanych, które po otwarciu nie nadają się do zwrotu ze względów higienicznych; towarów dostarczanych w zapieczętowanym opakowaniu, które po otwarciu nie nadają się do zwrotu. " +
        "Akcesoria dla zwierząt używane higienicznie (np. miski po użyciu, legowiska z sierścią, otwarte szczotki) mogą podlegać tym ograniczeniom — przed zwrotem skontaktuj się z nami. Usługi cyfrowe lub subskrypcje aplikacji GPS u producenta podlegają osobnym warunkom producenta.",
    },
    {
      title: "Jak odstąpić od umowy",
      body:
        `Wyślij jednoznaczne oświadczenie na ${email} (wystarczy e-mail) w terminie 14 dni. Możesz skorzystać z poniższego wzoru, ale nie jest to obowiązkowe.\n\n` +
        `— Wzór —\nJa, [imię i nazwisko], odstępuję od umowy sprzedaży następujących towarów: [nazwa / SKU], zamówienie nr [numer], data zamówienia [data]. Data: [data]. Podpis (w wiadomości e-mail wystarczy imię i nazwisko).\n\n` +
        `Adresat: ${entity.businessName}, ${entity.address}, ${email}.`,
    },
    {
      title: "Zwrot towaru i koszty",
      body:
        "Towar odeślij niezwłocznie, nie później niż 14 dni od dnia złożenia oświadczenia o odstąpieniu. Koszt odesłania ponosisz Ty, chyba że towar jest wadliwy lub niezgodny z umową — wtedy zwracamy rozsądny koszt przesyłki zwrotnej zgodnie z przepisami. " +
        "Towar powinien być możliwie nieużywany, kompletny i — o ile to możliwe — w oryginalnym opakowaniu.",
    },
    {
      title: "Zwrot środków",
      body:
        "Zwracamy wszystkie otrzymane od Ciebie płatności, w tym koszt najtańszej oferowanej przez nas dostawy, niezwłocznie, nie później niż 14 dni od dnia otrzymania oświadczenia o odstąpieniu. " +
        "Możemy wstrzymać się ze zwrotem do czasu otrzymania towaru lub dostarczenia dowodu jego odesłania. Zwrot realizujemy tą samą metodą płatności (Stripe), chyba że wyraźnie zgodzisz się na inną — bez dodatkowych opłat.",
    },
    {
      title: "Reklamacje (wady i niezgodność z umową)",
      body:
        `Reklamację zgłoś na ${email} z opisem wady, numerem zamówienia i — jeśli możesz — zdjęciami. Odpowiadamy w terminach wynikających z przepisów o prawach konsumenta. ` +
        "Niniejsza polityka nie wyłącza uprawnień z tytułu rękojmi ani gwarancji producenta, jeśli zostały udzielone.",
    },
  ];
}

function refundSectionsEn(tenant: Tenant): LegalSection[] {
  const email = supportEmail(tenant);
  return [
    {
      title: "Right of withdrawal (EU)",
      body: "Consumers may withdraw within 14 days of receiving goods, unless exceptions apply (sealed goods opened, custom items).",
    },
    {
      title: "How to request a refund",
      body: `Email ${email} with your order reference and reason. We respond within 14 business days.`,
    },
    {
      title: "Returns",
      body: "Return shipping costs may apply unless the product is defective or not as described. Items must be unused where applicable.",
    },
    {
      title: "Processing",
      body: "Approved refunds are issued to the original payment method via Stripe within 5–10 business days after we receive the return.",
    },
  ];
}

export function refundSections(tenant: Tenant): LegalSection[] {
  return isPolishLegal(tenant) ? refundSectionsPl(tenant) : refundSectionsEn(tenant);
}

function cookieSectionsPl(tenant: Tenant): LegalSection[] {
  const email = supportEmail(tenant);
  return [
    {
      title: "Czym są pliki cookie",
      body:
        "Pliki cookie to małe pliki tekstowe zapisywane w przeglądarce. Używamy ich wyłącznie w zakresie opisanym poniżej — bez reklamowych trackerów i bez sprzedaży danych.",
    },
    {
      title: "Niezbędne (zawsze aktywne)",
      body:
        "tenant-id, tenant-slug — rozpoznanie sklepu PawNest w systemie wielodostępnym (middleware). cookie-consent — zapis Twojej decyzji z paska zgody. " +
        "Te pliki są niezbędne do działania sklepu i nie wymagają zgody w rozumieniu dyrektywy ePrivacy w zakresie ściśle technicznym.",
    },
    {
      title: "Płatność (Stripe)",
      body:
        "Podczas przechodzenia do Stripe Checkout Stripe może ustawiać własne pliki cookie niezbędne do bezpiecznej płatności i zapobiegania oszustwom. Zasady Stripe opisuje dokumentacja Stripe i ich polityka prywatności.",
    },
    {
      title: "Analityka (Umami)",
      body:
        "Gdy skrypt Umami jest włączony, zbieramy zagregowane statystyki odwiedzin (cookieless — bez profilowania użytkownika). " +
        "Przycisk „Akceptuj analitykę” w pasku zgody zapisuje preferencję w cookie-consent; wybór „Tylko niezbędne” nie blokuje technicznej pracy sklepu.",
    },
    {
      title: "Jak zarządzać zgodą",
      body:
        `Możesz usunąć pliki cookie w ustawieniach przeglądarki lub zmienić decyzję, usuwając cookie cookie-consent i odświeżając stronę — pasek zgody pojawi się ponownie. Więcej o danych osobowych: /privacy-policy. Pytania: ${email}.`,
    },
  ];
}

function cookieSectionsEn(tenant: Tenant): LegalSection[] {
  const email = supportEmail(tenant);
  return [
    {
      title: "What we use",
      body: "Essential cookies: tenant-id, tenant-slug (store routing), cookie-consent (your choice). Stripe may set cookies during checkout. Umami analytics runs cookieless when enabled.",
    },
    {
      title: "Your choices",
      body: `Clear cookies in your browser or delete cookie-consent to see the banner again. Contact: ${email}. See also /privacy-policy.`,
    },
  ];
}

export function cookieSections(tenant: Tenant): LegalSection[] {
  return isPolishLegal(tenant) ? cookieSectionsPl(tenant) : cookieSectionsEn(tenant);
}

function impressumSectionsPl(tenant: Tenant): LegalSection[] {
  const entity = legalEntity(tenant);
  const regonLine = entity.regon ? ` REGON: ${entity.regon}.` : "";
  return [
    {
      title: "Dane sprzedawcy (draft)",
      body:
        `${entity.businessName}\n${entity.address}\nNIP: ${entity.nip}.${regonLine}\nE-mail: ${entity.email}\n\n` +
        "Powyższe pola są placeholderami do uzupełnienia przed publikacją sklepu. Po wpisaniu prawdziwych danych zaktualizuj theme_json.legal_entity w konfiguracji tenant store2 (migracja / panel).",
    },
    {
      title: "Sklep",
      body: `Nazwa handlowa: ${tenant.name}. Domena: ${tenant.domain}. Oferta: akcesoria dla psów i kotów (sklep internetowy, sprzedaż na odległość na terenie Polski i UE).`,
    },
    {
      title: "Informacja prawna",
      body:
        "Niniejsza strona ma charakter informacyjny i nie stanowi porady prawnej. Przed uruchomieniem sprzedaży na żywo uzupełnij dane podmiotu, zweryfikuj wymogi KSeF / VAT i ewentualne rejestracje, jeśli dotyczą Twojej działalności.",
    },
  ];
}

function impressumSectionsEn(tenant: Tenant): LegalSection[] {
  const entity = legalEntity(tenant);
  return [
    {
      title: "Seller information (draft)",
      body: `${entity.businessName}\n${entity.address}\nTax ID: ${entity.nip}\nEmail: ${entity.email}\n\nReplace placeholders before go-live.`,
    },
    {
      title: "Store",
      body: `${tenant.name} · ${tenant.domain}`,
    },
  ];
}

export function impressumSections(tenant: Tenant): LegalSection[] {
  return isPolishLegal(tenant) ? impressumSectionsPl(tenant) : impressumSectionsEn(tenant);
}

export type LegalPageId = "privacy" | "terms" | "refund" | "cookie" | "impressum";

export function legalPageTitle(tenant: Tenant, page: LegalPageId): string {
  if (!isPolishLegal(tenant)) {
    if (page === "privacy") return "Privacy Policy";
    if (page === "terms") return "Terms of Service";
    if (page === "refund") return "Refund Policy";
    if (page === "cookie") return "Cookie Policy";
    return "Seller information";
  }
  if (page === "privacy") return "Polityka prywatności";
  if (page === "terms") return "Regulamin sklepu";
  if (page === "refund") return "Polityka zwrotów i reklamacji";
  if (page === "cookie") return "Polityka cookies";
  return "Dane sprzedawcy";
}

export type FooterLegalLink = { href: string; label: string };

export function footerLegalLinks(tenant: Tenant): FooterLegalLink[] {
  if (isPolishLegal(tenant)) {
    return [
      { href: "/privacy-policy", label: "Prywatność" },
      { href: "/cookie-policy", label: "Cookies" },
      { href: "/terms-of-service", label: "Regulamin" },
      { href: "/refund-policy", label: "Zwroty" },
      { href: "/impressum", label: "Dane sprzedawcy" },
    ];
  }
  return [
    { href: "/privacy-policy", label: "Privacy" },
    { href: "/cookie-policy", label: "Cookies" },
    { href: "/terms-of-service", label: "Terms" },
    { href: "/refund-policy", label: "Refunds" },
    { href: "/impressum", label: "Seller info" },
  ];
}
