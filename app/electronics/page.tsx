import { NAV } from "@/lib/nav";
import { CardLink } from "@/components/card-link";

const section = NAV.find((s) => s.href === "/electronics")!;

export default function ElectronicsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-[var(--pea-space-6)] py-[var(--pea-space-10)]">
      <header className="mb-[var(--pea-space-8)]">
        <h1 className="text-[length:var(--pea-font-size-display-xs)] font-[var(--pea-font-weight-bold)]">
          Electronics · อิเล็กทรอนิกส์
        </h1>
        <p className="mt-[var(--pea-space-2)] text-[length:var(--pea-font-size-text-md)] text-[var(--pea-text-secondary)]">
          {section.descEn} · {section.descTh}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-[var(--pea-space-4)] md:grid-cols-2">
        {section.items?.map((item) => (
          <CardLink
            key={item.href}
            href={item.href}
            icon="cpu-chip-02"
            en={item.en}
            th={item.th}
          />
        ))}
      </section>
    </div>
  );
}
