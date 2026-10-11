"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={open} onNavigate={() => setOpen(false)} />

      {open ? (
        <div
          className="fixed inset-0 z-30 bg-[var(--pea-bg-overlay)] md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-[var(--pea-space-3)] border-b border-[var(--pea-border-secondary)] bg-[var(--pea-bg-primary)] px-[var(--pea-space-4)] py-[var(--pea-space-3)] md:hidden">
          <button
            type="button"
            aria-label="เปิดเมนู"
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-[var(--pea-rounded-md)] text-[20px] text-[var(--pea-text-secondary)] hover:bg-[var(--pea-bg-secondary)]"
          >
            <span className="icon menu-01" />
          </button>
          <span className="text-[length:var(--pea-font-size-text-md)] font-[var(--pea-font-weight-semibold)]">
            Electrical Calc
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
