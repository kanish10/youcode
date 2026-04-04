"use client";

import { useLanguage } from "@/lib/i18n";
import { useRouter } from "next/navigation";

const AFFIRMATIONS = [
  "Rest is not idleness. Healing takes courage.",
  "You are worthy of care — especially your own.",
  "Small steps are still steps. You are moving forward.",
  "Your story is still being written.",
  "You belong here. You matter.",
];

export default function HomePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const dailyAffirmation = AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length];

  return (
    <div className="max-w-lg mx-auto px-5 py-8 space-y-8">
      {/* Hero */}
      <section className="text-center mb-2">
        <h1 className="font-headline text-4xl font-bold text-on-surface mb-1">{t("home.title")}</h1>
        <p className="text-on-surface-variant text-sm">{t("home.subtitle")}</p>
      </section>

      {/* Mind / Body / Soul Pillars */}
      <div className="grid grid-cols-1 gap-4">
        {/* Mind */}
        <div className="bg-primary-container/25 rounded-2xl p-6 flex gap-5 items-center border border-primary/10 active:scale-[0.98] transition-transform cursor-pointer"
          onClick={() => router.push("/resident/grounding")}>
          <div className="w-14 h-14 bg-primary-container rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
          </div>
          <div className="flex-1">
            <h2 className="font-headline text-xl font-bold text-primary mb-1">{t("home.mind")}</h2>
            <p className="text-sm text-on-primary-container leading-relaxed">{t("home.mindDesc")}</p>
          </div>
          <button className="px-4 py-2 bg-primary text-on-primary rounded-full font-label text-xs font-semibold shrink-0">
            {t("home.mindCta")}
          </button>
        </div>

        {/* Body */}
        <div className="bg-secondary-container/25 rounded-2xl p-6 flex gap-5 items-center border border-secondary/10 active:scale-[0.98] transition-transform cursor-pointer"
          onClick={() => router.push("/resident/body")}>
          <div className="w-14 h-14 bg-secondary-container rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-secondary text-2xl">fitness_center</span>
          </div>
          <div className="flex-1">
            <h2 className="font-headline text-xl font-bold text-secondary mb-1">{t("home.body")}</h2>
            <p className="text-sm text-on-secondary-container leading-relaxed">{t("home.bodyDesc")}</p>
          </div>
          <button className="px-4 py-2 bg-secondary text-on-secondary rounded-full font-label text-xs font-semibold shrink-0">
            {t("home.bodyCta")}
          </button>
        </div>

        {/* Soul */}
        <div className="bg-tertiary-container/25 rounded-2xl p-6 flex gap-5 items-center border border-tertiary/10 active:scale-[0.98] transition-transform cursor-pointer"
          onClick={() => router.push("/resident/soul")}>
          <div className="w-14 h-14 bg-tertiary-container rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-tertiary text-2xl">auto_awesome</span>
          </div>
          <div className="flex-1">
            <h2 className="font-headline text-xl font-bold text-tertiary mb-1">{t("home.soul")}</h2>
            <p className="text-sm text-on-tertiary-container leading-relaxed">{t("home.soulDesc")}</p>
          </div>
          <button className="px-4 py-2 bg-tertiary text-on-tertiary rounded-full font-label text-xs font-semibold shrink-0">
            {t("home.soulCta")}
          </button>
        </div>
      </div>

      {/* Bento bottom row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Daily Intention */}
        <div className="bg-surface-container rounded-xl p-5 flex flex-col justify-between border border-outline-variant/20 min-h-[160px]">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase mb-2 block">{t("home.dailyIntention")}</span>
            <h3 className="font-headline text-base font-bold mb-2 leading-snug">{t("home.restQuote")}</h3>
            <p className="text-on-surface-variant text-xs leading-relaxed">{t("home.intentionBody")}</p>
          </div>
          <button
            onClick={() => router.push("/resident/soul")}
            className="mt-3 flex items-center gap-1.5 text-primary font-semibold text-xs"
          >
            {t("home.soulCta")} <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>

        {/* Today's affirmation */}
        <div className="bg-primary-container/20 rounded-xl p-5 flex flex-col justify-between border border-primary/10 min-h-[160px]">
          <span className="material-symbols-outlined text-primary text-2xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
          <p className="font-headline text-sm font-semibold text-on-surface leading-relaxed italic flex-1">
            &ldquo;{dailyAffirmation}&rdquo;
          </p>
          <button
            onClick={() => router.push("/resident/chat")}
            className="mt-3 flex items-center gap-1.5 text-primary font-semibold text-xs"
          >
            {t("nav.chat")} <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
