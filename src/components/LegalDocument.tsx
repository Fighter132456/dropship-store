import type { Tenant } from "@/types/store";

type LegalSection = {
  title: string;
  body: string;
};

type LegalDocumentProps = {
  tenant: Tenant;
  title: string;
  sections: LegalSection[];
};

export function LegalDocument({ tenant, title, sections }: LegalDocumentProps) {
  const primary = tenant.theme_json.colors?.primary ?? "#2563eb";

  return (
    <article className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">{title}</h1>
      <p className="mb-8 text-sm text-slate-500">
        {tenant.name} · Last updated: {new Date().toISOString().slice(0, 10)} · Draft for
        pre-launch review
      </p>
      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 text-lg font-semibold" style={{ color: primary }}>
              {section.title}
            </h2>
            <p className="leading-relaxed text-slate-700">{section.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
