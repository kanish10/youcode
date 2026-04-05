"use client";

import Sidebar from "@/components/sidebar";
import { LanguageProvider } from "@/lib/i18n";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="ml-64 flex-1 min-h-screen bg-surface">
          {children}
        </main>
      </div>
    </LanguageProvider>
  );
}
