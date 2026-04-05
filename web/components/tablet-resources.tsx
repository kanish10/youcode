"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import {
  RESOURCES,
  RESOURCE_CATEGORIES,
  CATEGORY_STYLES,
  type ResourceCategory,
} from "@/lib/resources";

const CATEGORY_INFO: {
  id: ResourceCategory;
  icon: string;
  titleKey: string;
  descKey: string;
  bgClass: string;
  iconBgClass: string;
}[] = [
  {
    id: "mental", icon: "psychology",
    titleKey: "resources.catMental", descKey: "resources.mentalDesc",
    bgClass: "bg-tertiary-container/20 border-tertiary/15",
    iconBgClass: "bg-tertiary-container/50 text-tertiary",
  },
  {
    id: "food", icon: "restaurant",
    titleKey: "resources.catFood", descKey: "resources.foodDesc",
    bgClass: "bg-secondary-container/20 border-secondary/15",
    iconBgClass: "bg-secondary-container/50 text-secondary",
  },
  {
    id: "housing", icon: "home_work",
    titleKey: "resources.catHousing", descKey: "resources.housingDesc",
    bgClass: "bg-primary-container/20 border-primary/15",
    iconBgClass: "bg-primary-container/50 text-primary",
  },
  {
    id: "safety", icon: "security",
    titleKey: "resources.catSafety", descKey: "resources.safetyDesc",
    bgClass: "bg-error-container/15 border-error/10",
    iconBgClass: "bg-error-container/40 text-error",
  },
  {
    id: "counselling", icon: "support_agent",
    titleKey: "resources.catCounselling", descKey: "resources.mentalDesc",
    bgClass: "bg-tertiary-container/15 border-tertiary/10",
    iconBgClass: "bg-tertiary-container/50 text-tertiary",
  },
  {
    id: "employment", icon: "work",
    titleKey: "resources.catEmployment", descKey: "resources.foodDesc",
    bgClass: "bg-secondary-container/15 border-secondary/10",
    iconBgClass: "bg-secondary-container/50 text-secondary",
  },
];

export default function TabletResources() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | "all">("all");

  const showCategoryCards = activeCategory === "all" && !search.trim();

  const filtered = RESOURCES.filter((r) => {
    const matchesCategory = activeCategory === "all" || r.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.category.includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-primary font-bold tracking-widest text-xs uppercase">{t("resources.nearby")}</span>
        <h2 className="font-headline text-3xl text-on-surface mt-1 font-bold">{t("resources.title")}</h2>
        <p className="text-on-surface-variant mt-1 text-sm max-w-lg">{t("resources.subtitle")}</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("resources.searchPlaceholder")}
            className="px-4 py-2.5 pl-10 rounded-xl border border-outline-variant/20 bg-white text-sm w-72 focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {RESOURCE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                activeCategory === cat.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-on-surface-variant border border-outline-variant/20 hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-sm">{cat.icon}</span>
              {t(cat.labelKey as any)}
            </button>
          ))}
        </div>
      </div>

      {/* Category overview cards */}
      {showCategoryCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORY_INFO.map((cat) => {
            const count = RESOURCES.filter((r) => r.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-2xl border p-5 flex items-center gap-4 text-left transition-all hover:shadow-md hover:-translate-y-0.5 ${cat.bgClass}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cat.iconBgClass}`}>
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {cat.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline font-semibold text-on-surface">{t(cat.titleKey as any)}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5">{t(cat.descKey as any)}</p>
                  <p className="text-[10px] text-on-surface-variant mt-1">{count} resources</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Active filter header */}
      {activeCategory !== "all" && (
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-xl font-semibold text-on-surface">
            {t((CATEGORY_INFO.find((c) => c.id === activeCategory)?.titleKey ?? "resources.allCategories") as any)}
          </h3>
          <button
            onClick={() => setActiveCategory("all")}
            className="text-xs text-primary font-medium hover:underline"
          >
            {t("resources.allCategories")}
          </button>
        </div>
      )}

      {/* Resource cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
            <p className="text-sm">No resources found. Try a different search or category.</p>
          </div>
        )}
        {filtered.map((r) => {
          const style = CATEGORY_STYLES[r.category];
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${r.latitude},${r.longitude}`;
          return (
            <article
              key={r.id}
              className="rounded-xl border border-outline-variant/10 p-5 hover:shadow-md transition-all bg-white"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded-xl shrink-0 ${style.icon}`}>
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {RESOURCE_CATEGORIES.find((c) => c.id === r.category)?.icon ?? "info"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.tag}`}>
                      {t(`resources.cat${r.category.charAt(0).toUpperCase() + r.category.slice(1)}` as any)}
                    </span>
                    {r.hours && (
                      <span className="text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                        {r.hours}
                      </span>
                    )}
                  </div>
                  <h3 className="font-headline font-semibold text-on-surface leading-tight">{r.name}</h3>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{r.description}</p>

              {r.address && (
                <p className="text-xs text-on-surface-variant mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  {r.address}, {r.city}
                </p>
              )}

              {r.languages.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {r.languages.slice(0, 4).map((lang) => (
                    <span key={lang} className="text-[9px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded">
                      {lang}
                    </span>
                  ))}
                  {r.languages.length > 4 && (
                    <span className="text-[9px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded">
                      +{r.languages.length - 4}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/10 flex-wrap">
                {r.phone && (
                  <a
                    href={`tel:${r.phone.replace(/[^+\d]/g, "")}`}
                    className="flex items-center gap-1.5 text-primary font-semibold text-xs hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                    {r.phone}
                  </a>
                )}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-on-surface-variant text-xs hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">map</span>
                  {t("resources.viewMap")}
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
