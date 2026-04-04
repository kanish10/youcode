"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { EXERCISES, CATEGORIES, TINT_CLASSES, type ExerciseCategory } from "@/lib/exercises";
import { useRouter } from "next/navigation";

export default function BodyPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [active, setActive] = useState<ExerciseCategory | "all">("all");

  const filtered = active === "all" ? EXERCISES : EXERCISES.filter((e) => e.category === active);

  const diffLabel = (d: string) => {
    if (d === "gentle") return t("common.gentle");
    if (d === "moderate") return t("common.moderate");
    return t("common.active");
  };

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      {/* Header */}
      <section className="mb-6">
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-1">{t("body.title")}</h1>
        <p className="text-on-surface-variant text-sm">{t("body.subtitle")}</p>
      </section>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
              active === cat.id
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container text-on-surface-variant border border-outline-variant/30"
            }`}
          >
            <span className="material-symbols-outlined text-base">{cat.icon}</span>
            {t(cat.labelKey as Parameters<typeof t>[0])}
          </button>
        ))}
      </div>

      {/* Exercise Cards */}
      <div className="space-y-4">
        {filtered.map((ex) => {
          const tint = TINT_CLASSES[ex.tint];
          return (
            <button
              key={ex.id}
              onClick={() => router.push(`/resident/body/${ex.id}`)}
              className={`w-full text-left rounded-2xl p-5 flex gap-4 items-center border ${tint.card} active:scale-[0.98] transition-all duration-200`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${tint.icon}`}>
                <span className="material-symbols-outlined text-2xl">{ex.icon}</span>
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tint.badge}`}>
                    {diffLabel(ex.difficulty)}
                  </span>
                  {ex.isSeated && (
                    <span className="text-[10px] font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                      {t("body.seatedLabel")}
                    </span>
                  )}
                </div>
                <h3 className="font-headline font-semibold text-on-surface text-base leading-tight">{ex.name}</h3>
                <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2 leading-relaxed">{ex.desc}</p>
              </div>
              {/* Duration */}
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-on-surface">{ex.durationMin}</p>
                <p className="text-[10px] text-on-surface-variant">{t("common.min")}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
