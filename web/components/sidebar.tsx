"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useLanguage, LANGUAGES } from "@/lib/i18n";

const NAV_ITEMS = [
  { href: "/dashboard", labelKey: "sidebar.livingGarden" as const, icon: "local_florist" },
  { href: "/dashboard/activity-logs", labelKey: "sidebar.activityLogs" as const, icon: "timeline" },
  { href: "/dashboard/residents", labelKey: "sidebar.residents" as const, icon: "group" },
  { href: "/dashboard/resources", labelKey: "sidebar.resourceHub" as const, icon: "library_books" },
  { href: "/dashboard/shelter-map", labelKey: "sidebar.shelterMap" as const, icon: "map" },
  { href: "/tablet", labelKey: "sidebar.shelterTablet" as const, icon: "tablet_mac", external: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const [showLangPanel, setShowLangPanel] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <aside className="flex flex-col h-full w-64 fixed left-0 top-0 bg-surface-container border-r border-outline-variant/15 z-50">
      <div className="px-8 py-10">
        <h1 className="text-xl font-headline text-primary tracking-wide">Bloom</h1>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1 font-medium">{t("sidebar.staffDashboard")}</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
          const cls = `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                ${active
                  ? "text-primary font-bold bg-surface-variant/50 border-r-4 border-primary"
                  : "text-on-surface-variant hover:bg-surface-variant/40"
                }`;
          if ("external" in item && item.external) {
            return (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="text-sm">{t(item.labelKey)}</span>
              </a>
            );
          }
          return (
            <Link key={item.href} href={item.href} className={cls}>
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-sm">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-outline-variant/10 space-y-2">
        <button
          onClick={() => setShowLangPanel(true)}
          className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors w-full px-4 py-2 rounded-lg hover:bg-surface-variant/30"
        >
          <span className="material-symbols-outlined text-xl">translate</span>
          <span className="text-sm font-medium">{t("sidebar.language")}</span>
          <span className="ml-auto text-xs font-bold uppercase text-primary">{lang}</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-on-surface-variant hover:text-error transition-colors w-full px-4 py-2 rounded-lg hover:bg-surface-variant/30"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="text-sm font-medium">{t("sidebar.signOut")}</span>
        </button>
      </div>

      {/* Language picker panel */}
      {showLangPanel && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center" onClick={() => setShowLangPanel(false)}>
          <div
            className="bg-background rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">translate</span>
                <h3 className="font-headline text-lg font-semibold text-on-surface">{t("sidebar.chooseLang")}</h3>
              </div>
              <button onClick={() => setShowLangPanel(false)} className="p-2 rounded-full hover:bg-surface-container">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2 overflow-y-auto max-h-[60vh]">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setShowLangPanel(false); }}
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
      )}
    </aside>
  );
}
