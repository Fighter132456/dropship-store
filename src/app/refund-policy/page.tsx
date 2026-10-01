import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/LegalDocument";
import { StoreShell } from "@/components/StoreShell";
import { refundSections } from "@/lib/legal-content";
import { getTenant } from "@/lib/tenant";

export default async function RefundPolicyPage() {
  const tenant = await getTenant();
  if (!tenant) notFound();

  return (
    <StoreShell tenant={tenant}>
      <LegalDocument
        tenant={tenant}
        title="Refund Policy"
        sections={refundSections(tenant)}
      />
    </StoreShell>
  );
}
