import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/LegalDocument";
import { StoreShell } from "@/components/StoreShell";
import { impressumSections, legalPageTitle } from "@/lib/legal-content";
import { buildLegalMetadata } from "@/lib/seo-meta";
import { getTenant } from "@/lib/tenant";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  if (!tenant) return { title: "Impressum" };
  return buildLegalMetadata(tenant, "impressum", "/impressum");
}

export default async function ImpressumPage() {
  const tenant = await getTenant();
  if (!tenant) notFound();

  return (
    <StoreShell tenant={tenant}>
      <LegalDocument
        tenant={tenant}
        title={legalPageTitle(tenant, "impressum")}
        sections={impressumSections(tenant)}
      />
    </StoreShell>
  );
}
