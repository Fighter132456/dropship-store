import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/LegalDocument";
import { StoreShell } from "@/components/StoreShell";
import { termsSections } from "@/lib/legal-content";
import { getTenant } from "@/lib/tenant";

export default async function TermsOfServicePage() {
  const tenant = await getTenant();
  if (!tenant) notFound();

  return (
    <StoreShell tenant={tenant}>
      <LegalDocument
        tenant={tenant}
        title="Terms of Service"
        sections={termsSections(tenant)}
      />
    </StoreShell>
  );
}
