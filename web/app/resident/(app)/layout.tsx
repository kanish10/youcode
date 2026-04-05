"use client";

import { LanguageProvider, useLanguage, LANGUAGES } from "@/lib/i18n";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import VoiceAssistant from "@/components/VoiceAssistant";

const NAV_ITEMS = [
  { href: "/resident/garden",    icon: "local_florist",   labelKey: "nav.garden" as const },
  { href: "/resident/home",      icon: "self_improvement",labelKey: "nav.sanctuary" as const },
  { href: "/resident/chat",      icon: "chat_bubble",     labelKey: "nav.chat" as const },
  { href: "/resident/connect",   icon: "group",           labelKey: "nav.connect" as const },
  { href: "/resident/resources", icon: "info",            labelKey: "nav.resources" as const },
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

function LanguagePanel({ onClose }: { onClose: () => void }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/40 z-[70] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-background rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">translate</span>
            <h3 className="font-headline font-semibold text-on-surface">{t("welcome.chooseLanguage")}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-2 overflow-y-auto max-h-[60vh]">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); onClose(); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                lang === l.code
                  ? "bg-primary-container border-2 border-primary"
                  : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${lang === l.code ? "text-primary" : "text-on-surface"}`}>
                  {l.nativeLabel}
                </p>
                <p className="text-[10px] text-on-surface-variant">{l.label}</p>
              </div>
              {lang === l.code && (
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const { rtl, lang, bloomId } = useLanguage();
  const [showLang, setShowLang] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24" dir={rtl ? "rtl" : "ltr"} lang={lang}>
      {/* Top App Bar */}
      <header className="bg-surface-container-low border-b border-outline-variant/30 sticky top-0 z-40 flex justify-between items-center w-full px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
          <span className="text-xl font-headline font-bold text-primary">Bloom</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Language button */}
          <button
            onClick={() => setShowLang(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
            title="Change language"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-lg">translate</span>
            <span className="text-xs font-medium text-on-surface-variant uppercase">{lang}</span>
          </button>
          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center border border-primary/20">
            {bloomId ? (
              <span className="text-xs font-bold text-primary">{bloomId.charAt(0).toUpperCase()}</span>
            ) : (
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <BottomNav />
      <VoiceAssistant />
      {showLang && <LanguagePanel onClose={() => setShowLang(false)} />}
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
