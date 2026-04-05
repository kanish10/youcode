"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import {
  RESOURCES,
  RESOURCE_CATEGORIES,
  CATEGORY_STYLES,
  type ResourceCategory,
  type Resource,
} from "@/lib/resources";

function ResourceCard({ r, t, onSelect }: { r: Resource; t: (k: any) => string; onSelect: (r: Resource) => void }) {
  const style = CATEGORY_STYLES[r.category];
  const cat = RESOURCE_CATEGORIES.find((c) => c.id === r.category);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${r.latitude},${r.longitude}`;

  return (
    <div className={`rounded-2xl p-5 border border-outline-variant/20 ${style.bg} transition-all hover:shadow-md`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl shrink-0 ${style.icon}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{cat?.icon ?? "info"}</span>
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
          <h3 className="font-headline font-semibold text-on-surface text-base leading-tight">{r.name}</h3>
          <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">{r.description}</p>

          {r.address && (
            <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">location_on</span>
              {r.address}, {r.city}
            </p>
          )}

          {r.languages.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {r.languages.slice(0, 3).map((lang) => (
                <span key={lang} className="text-[9px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded">
                  {lang}
                </span>
              ))}
              {r.languages.length > 3 && (
                <span className="text-[9px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded">
                  +{r.languages.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {r.phone && (
              <a
                href={`tel:${r.phone.replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary text-xs font-medium active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                {t("resources.callNow")}
              </a>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium hover:bg-surface-container-high active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm">directions</span>
              {t("resources.directions")}
            </a>
            <button
              onClick={() => onSelect(r)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium hover:bg-surface-container-high active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm">map</span>
              {t("resources.viewMap")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapModal({ resource, onClose, t }: { resource: Resource; onClose: () => void; t: (k: any) => string }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${resource.latitude},${resource.longitude}`;
  const embedUrl = `https://www.google.com/maps?q=${resource.latitude},${resource.longitude}&z=15&output=embed`;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-background rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/20">
          <div className="flex-1 min-w-0">
            <h3 className="font-headline font-semibold text-on-surface truncate">{resource.name}</h3>
            <p className="text-xs text-on-surface-variant">{resource.address}, {resource.city}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Map Embed */}
        <div className="relative w-full" style={{ paddingBottom: "60%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={embedUrl}
            title={resource.name}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* Details */}
        <div className="p-4 space-y-3">
          {resource.phone && (
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-primary text-lg">call</span>
              <a href={`tel:${resource.phone.replace(/[^+\d]/g, "")}`} className="text-primary font-medium">{resource.phone}</a>
            </div>
          )}
          {resource.hours && (
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">schedule</span>
              <span className="text-on-surface-variant">{resource.hours}</span>
            </div>
          )}
          {resource.languages.length > 0 && (
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">translate</span>
              <span className="text-on-surface-variant">{resource.languages.join(", ")}</span>
            </div>
          )}

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full py-3 bg-primary text-on-primary rounded-xl flex items-center justify-center gap-2 font-semibold text-sm active:scale-[0.98] transition-transform"
          >
            <span className="material-symbols-outlined text-lg">open_in_new</span>
            {t("resources.openInMaps")}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | "all">("all");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const filtered = RESOURCES.filter((r) => {
    const matchesCategory = activeCategory === "all" || r.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch = !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.category.includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-lg mx-auto px-5 py-8 space-y-5 pb-28">
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
          className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {RESOURCE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
              activeCategory === cat.id
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container text-on-surface-variant border border-outline-variant/30"
            }`}
          >
            <span className="material-symbols-outlined text-sm">{cat.icon}</span>
            {t(cat.labelKey as any)}
          </button>
        ))}
      </div>

      {/* Resource Cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
            <p className="text-sm">No resources found. Try a different search or category.</p>
          </div>
        )}
        {filtered.map((r) => (
          <ResourceCard key={r.id} r={r} t={t} onSelect={setSelectedResource} />
        ))}
      </div>

      {/* Map Modal */}
      {selectedResource && (
        <MapModal resource={selectedResource} onClose={() => setSelectedResource(null)} t={t} />
      )}
    </div>
  );
}
