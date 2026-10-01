import { TenantNotFound } from "@/components/TenantNotFound";

type TenantNotFoundPageProps = {
  searchParams: Promise<{ host?: string }>;
};

export default async function TenantNotFoundPage({ searchParams }: TenantNotFoundPageProps) {
  const params = await searchParams;
  return <TenantNotFound host={params.host} />;
}
