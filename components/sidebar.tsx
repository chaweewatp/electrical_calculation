"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV, isActive } from "@/lib/nav";

export function Sidebar({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>(() =>
    NAV.filter((s) => s.items?.some((i) => isActive(pathname, i.href))).map(
      (s) => s.href,
    ),
  );

  const toggle = (href: string) =>
    setExpanded((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href],
    );

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-[var(--pea-border-secondary)] bg-[var(--pea-bg-primary)] transition-transform md:static md:z-auto md:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center gap-[var(--pea-space-2)] border-b border-[var(--pea-border-secondary)] px-[var(--pea-space-5)] py-[var(--pea-space-4)]">
        <span className="flex h-8 w-8 items-center justify-center rounded-[var(--pea-rounded-md)] bg-[var(--pea-bg-brand-solid)] text-[18px] text-[var(--pea-text-white)]">
          <span className="icon graduation-hat-01" />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-[length:var(--pea-font-size-text-sm)] font-[var(--pea-font-weight-semibold)]">
            Electrical Calc
          </span>
          <span className="text-[length:var(--pea-font-size-text-xs)] text-[var(--pea-text-tertiary)]">
            ฝึกคำนวณไฟฟ้า
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-[var(--pea-space-3)]">
        {NAV.map((section) => {
          const active = isActive(pathname, section.href);
          const hasItems = !!section.items?.length;
          const isOpen = expanded.includes(section.href);
          const rowCls = `flex w-full items-center gap-[var(--pea-space-3)] rounded-[var(--pea-rounded-md)] px-[var(--pea-space-3)] py-[var(--pea-space-2)] text-left text-[length:var(--pea-font-size-text-sm)] transition-colors ${
            active
              ? "bg-[var(--pea-bg-brand-section)] font-[var(--pea-font-weight-semibold)] text-[var(--pea-text-brand-secondary)]"
              : "text-[var(--pea-text-secondary)] hover:bg-[var(--pea-bg-secondary)]"
          }`;
          return (
            <div key={section.href} className="mb-[var(--pea-space-1)]">
              {hasItems ? (
                <button
                  type="button"
                  onClick={() => toggle(section.href)}
                  className={rowCls}
                  aria-expanded={isOpen}
                >
                  <span className={`icon ${section.icon} text-[18px]`} />
                  <span className="flex-1">{section.en}</span>
                  <span
                    className={`icon ${isOpen ? "chevron-up" : "chevron-down"} text-[var(--pea-text-tertiary)]`}
                  />
                </button>
              ) : (
                <Link
                  href={section.href}
                  onClick={onNavigate}
                  className={rowCls}
                  aria-current={active ? "page" : undefined}
                >
                  <span className={`icon ${section.icon} text-[18px]`} />
                  <span className="flex-1">{section.en}</span>
                </Link>
              )}
              {hasItems && isOpen ? (
                <div className="mt-[var(--pea-space-1)] flex flex-col gap-[2px] pl-[var(--pea-space-8)]">
                  {section.items!.map((item) => {
                    const itemActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={itemActive ? "page" : undefined}
                        className={`rounded-[var(--pea-rounded-md)] px-[var(--pea-space-3)] py-[var(--pea-space-2)] text-[length:var(--pea-font-size-text-sm)] transition-colors ${
                          itemActive
                            ? "bg-[var(--pea-bg-brand-section)] font-[var(--pea-font-weight-semibold)] text-[var(--pea-text-brand-secondary)]"
                            : "text-[var(--pea-text-secondary)] hover:bg-[var(--pea-bg-secondary)]"
                        }`}
                      >
                        {item.en}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-[var(--pea-border-secondary)] px-[var(--pea-space-5)] py-[var(--pea-space-3)] text-[length:var(--pea-font-size-text-xs)] text-[var(--pea-text-tertiary)]">
        © 2026 PEA
      </div>
    </aside>
  );
}
