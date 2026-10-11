import Link from "next/link";

export function CardLink({
  href,
  icon,
  en,
  th,
  desc,
}: {
  href: string;
  icon: string;
  en: string;
  th: string;
  desc?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex gap-[var(--pea-space-4)] rounded-[var(--pea-rounded-lg)] border border-[var(--pea-border-secondary)] bg-[var(--pea-bg-primary)] p-[var(--pea-space-5)] transition-colors hover:border-[var(--pea-border-brand)] hover:bg-[var(--pea-bg-brand-section)]"
    >
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--pea-rounded-md)] bg-[var(--pea-bg-brand-section)] text-[20px] text-[var(--pea-text-brand-secondary)] group-hover:bg-[var(--pea-bg-primary)]">
        <span className={`icon ${icon}`} />
      </span>
      <span className="flex flex-col">
        <span className="text-[length:var(--pea-font-size-text-md)] font-[var(--pea-font-weight-semibold)]">
          {en}
        </span>
        <span className="text-[length:var(--pea-font-size-text-sm)] text-[var(--pea-text-secondary)]">
          {th}
        </span>
        {desc ? (
          <span className="mt-[var(--pea-space-1)] text-[length:var(--pea-font-size-text-sm)] text-[var(--pea-text-tertiary)]">
            {desc}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
