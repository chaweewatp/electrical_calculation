import { NAV } from "@/lib/nav";
import { CardLink } from "@/components/card-link";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-[var(--pea-space-6)] py-[var(--pea-space-10)]">
      <header className="mb-[var(--pea-space-8)]">
        <h1 className="text-[length:var(--pea-font-size-display-sm)] font-[var(--pea-font-weight-bold)]">
          Electrical Calculation Training
        </h1>
        <p className="mt-[var(--pea-space-2)] text-[length:var(--pea-font-size-text-md)] text-[var(--pea-text-secondary)]">
          ฝึกคำนวณวงจรไฟฟ้าและอิเล็กทรอนิกส์ เลือกหมวดหมู่เพื่อเริ่มต้น
        </p>
      </header>

      <section className="grid grid-cols-1 gap-[var(--pea-space-4)] md:grid-cols-2">
        {NAV.map((section) => (
          <CardLink
            key={section.href}
            href={section.href}
            icon={section.icon}
            en={section.en}
            th={section.th}
            desc={`${section.descEn} · ${section.descTh}`}
          />
        ))}
      </section>
    </div>
  );
}
