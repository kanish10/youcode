"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";

const RESOURCES = [
  {
    key: "housing" as const,
    icon: "home_work",
    tint: "primary",
    tagKey: "resources.housingTag" as const,
    phone: null,
    url: "https://www.bc211.ca",
  },
  {
    key: "food" as const,
    icon: "nutrition",
    tint: "secondary",
    tagKey: "resources.foodTag" as const,
    phone: null,
    url: "https://www.bc211.ca",
  },
  {
    key: "mental" as const,
    icon: "psychology_alt",
    tint: "tertiary",
    tagKey: "resources.mentalTag" as const,
    phone: null,
    url: "https://www.bc211.ca",
  },
  {
    key: "safety" as const,
    icon: "security",
    tint: "error",
    tagKey: "resources.safetyTag" as const,
    phone: "911",
    url: null,
  },
];

const TINT_CARD: Record<string, { card: string; icon: string; tag: string; title: string }> = {
  primary:   { card: "bg-primary-container/30 border-primary-fixed-dim",   icon: "bg-primary-container text-primary",   tag: "text-primary",   title: "text-on-primary-container" },
  secondary: { card: "bg-secondary-container/40 border-secondary-fixed-dim", icon: "bg-secondary-container text-secondary", tag: "text-secondary", title: "text-on-secondary-container" },
  tertiary:  { card: "bg-tertiary-container/30 border-tertiary-fixed-dim",  icon: "bg-tertiary-container text-tertiary",  tag: "text-tertiary",  title: "text-on-tertiary-container" },
  error:     { card: "bg-error-container/10 border-error-container/20",    icon: "bg-error-container/20 text-error",     tag: "text-error",     title: "text-on-error-container" },
};

export default function ResourcesPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  const filtered = RESOURCES.filter((r) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      t(`resources.${r.key}` as Parameters<typeof t>[0]).toLowerCase().includes(q) ||
      t(`resources.${r.key}Desc` as Parameters<typeof t>[0]).toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-lg mx-auto px-5 py-8 space-y-6">
      {/* Header */}
      <section>
        <h1 className="font-headline text-3xl font-bold text-on-surface leading-tight">{t("resources.title")}</h1>
        <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">{t("resources.subtitle")}</p>
      </section>

      {/* BC211 CTA */}
      <a
        href="tel:211"
        className="w-full bg-primary py-4 px-6 rounded-xl flex items-center justify-between active:scale-[0.98] transition-all duration-200 shadow-sm block"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>phone_in_talk</span>
          <span className="font-label font-bold text-white tracking-wide">{t("resources.callBC211")}</span>
        </div>
        <div className="bg-white/20 px-3 py-1 rounded-full">
          <span className="text-white text-xs font-bold">24/7</span>
        </div>
      </a>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("resources.searchPlaceholder")}
          className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((r) => {
          const c = TINT_CARD[r.tint];
          const href = r.phone ? `tel:${r.phone}` : r.url ?? "#";
          return (
            <a
              key={r.key}
              href={href}
              target={r.url ? "_blank" : undefined}
              rel={r.url ? "noopener noreferrer" : undefined}
              className={`rounded-2xl p-5 flex gap-5 items-start border ${c.card} active:scale-[0.98] transition-all duration-200 block`}
            >
              <div className={`p-3 rounded-xl shrink-0 ${c.icon}`}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{r.icon}</span>
              </div>
              <div className="flex-1 space-y-1">
                <h3 className={`font-headline font-semibold text-lg ${c.title}`}>
                  {t(`resources.${r.key}` as Parameters<typeof t>[0])}
                </h3>
                <p className="text-sm text-on-surface-variant">
                  {t(`resources.${r.key}Desc` as Parameters<typeof t>[0])}
                </p>
                <div className="pt-2">
                  <span className={`px-2 py-0.5 bg-white rounded text-[10px] font-bold uppercase ${c.tag}`}>
                    {t(r.tagKey)}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
