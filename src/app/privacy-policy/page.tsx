import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/LegalDocument";
import { StoreShell } from "@/components/StoreShell";
import { legalPageTitle, privacySections } from "@/lib/legal-content";
import { buildLegalMetadata } from "@/lib/seo-meta";
import { getTenant } from "@/lib/tenant";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  if (!tenant) return { title: "Privacy" };
  return buildLegalMetadata(tenant, "privacy", "/privacy-policy");
}

export default async function PrivacyPolicyPage() {
  const tenant = await getTenant();
  if (!tenant) notFound();

  return (
    <StoreShell tenant={tenant}>
      <LegalDocument
        tenant={tenant}
        title={legalPageTitle(tenant, "privacy")}
        sections={privacySections(tenant)}
      />
    </StoreShell>
  );
}
