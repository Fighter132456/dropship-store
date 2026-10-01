import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/LegalDocument";
import { StoreShell } from "@/components/StoreShell";
import { privacySections } from "@/lib/legal-content";
import { getTenant } from "@/lib/tenant";

export default async function PrivacyPolicyPage() {
  const tenant = await getTenant();
  if (!tenant) notFound();

  return (
    <StoreShell tenant={tenant}>
      <LegalDocument
        tenant={tenant}
        title="Privacy Policy"
        sections={privacySections(tenant)}
      />
    </StoreShell>
  );
}
