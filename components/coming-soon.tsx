import { EmptyState } from "@pea-ds/react/empty-state";

export function ComingSoon({
  en,
  th,
  icon,
}: {
  en: string;
  th: string;
  icon: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-[var(--pea-space-6)] py-[var(--pea-space-16)]">
      <EmptyState
        size="lg"
        variant="featured-icon"
        icon={icon}
        showIcon
        title={`${en} · ${th}`}
        supportingText="เนื้อหากำลังจะมาเร็ว ๆ นี้ — Content coming soon"
      />
    </div>
  );
}
