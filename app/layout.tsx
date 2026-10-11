import type { Metadata } from "next";
import { ThemeProvider } from "@pea-ds/react/provider";
import "@pea-ds/base/styles.css";
import "@pea-ds/react/style.css";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Electrical Calculation Training",
  description: "ฝึกคำนวณวงจรไฟฟ้า",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full bg-[var(--pea-bg-secondary)] text-[var(--pea-text-primary)]">
        <ThemeProvider brand="pea" defaultTheme="light">
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
