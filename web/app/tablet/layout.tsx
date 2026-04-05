"use client";

import { LanguageProvider } from "@/lib/i18n";

export default function TabletLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-surface text-on-surface">{children}</div>
    </LanguageProvider>
  );
}
