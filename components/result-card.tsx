export function ResultCard({
  label,
  value,
  hint,
  highlight,
}: {
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--pea-rounded-lg)] border p-[var(--pea-space-4)] ${
        highlight
          ? "bg-[var(--pea-bg-brand-section)] border-[var(--pea-border-brand)]"
          : "bg-[var(--pea-bg-primary)] border-[var(--pea-border-secondary)]"
      }`}
    >
      <p className="text-[length:var(--pea-font-size-text-sm)] text-[var(--pea-text-secondary)]">
        {label}
      </p>
      <p className="mt-1 text-[length:var(--pea-font-size-text-xl)] font-[var(--pea-font-weight-semibold)]">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-[length:var(--pea-font-size-text-xs)] text-[var(--pea-text-tertiary)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
