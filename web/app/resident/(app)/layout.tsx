"use client";

import { LanguageProvider, useLanguage } from "@/lib/i18n";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode } from "react";
import VoiceAssistant from "@/components/VoiceAssistant";

const NAV_ITEMS = [
  { href: "/resident/garden",    icon: "local_florist",   labelKey: "nav.garden" as const },
  { href: "/resident/home",      icon: "self_improvement",labelKey: "nav.sanctuary" as const },
  { href: "/resident/connect",   icon: "group",           labelKey: "nav.connect" as const },
  { href: "/resident/resources", icon: "info",            labelKey: "nav.resources" as const },
  { href: "/resident/chat",      icon: "chat_bubble",     labelKey: "nav.chat" as const },
];

function BottomNav() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface-container-low border-t border-outline-variant/30 rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
              active
                ? "bg-primary-container/50 text-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-medium font-label">{t(item.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const { rtl, lang, bloomId } = useLanguage();
  return (
    <div className="min-h-screen bg-background text-on-surface pb-24" dir={rtl ? "rtl" : "ltr"} lang={lang}>
      {/* Top App Bar */}
      <header className="bg-surface-container-low border-b border-outline-variant/30 sticky top-0 z-40 flex justify-between items-center w-full px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
          <span className="text-xl font-headline font-bold text-primary">Bloom</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center border border-primary/20">
          {bloomId ? (
            <span className="text-xs font-bold text-primary">{bloomId.charAt(0).toUpperCase()}</span>
          ) : (
            <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          )}
        </div>
      </header>
      <main>{children}</main>
      <BottomNav />
      <VoiceAssistant />
    </div>
  );
}

export default function ResidentAppLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <Shell>{children}</Shell>
    </LanguageProvider>
  );
}
