"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { logResidentActivity } from "@/lib/kioskActivity";

const STEPS = [
  { numKey: "grounding.step1" as const, descKey: "grounding.step1Desc" as const, num: 5, icon: "visibility", color: "primary" },
  { numKey: "grounding.step2" as const, descKey: "grounding.step2Desc" as const, num: 4, icon: "back_hand", color: "secondary" },
  { numKey: "grounding.step3" as const, descKey: "grounding.step3Desc" as const, num: 3, icon: "hearing", color: "tertiary" },
  { numKey: "grounding.step4" as const, descKey: "grounding.step4Desc" as const, num: 2, icon: "air", color: "primary" },
  { numKey: "grounding.step5" as const, descKey: "grounding.step5Desc" as const, num: 1, icon: "restaurant", color: "secondary" },
] as const;

const COLOR_CLASSES: Record<string, { ring: string; bg: string; text: string; num: string }> = {
  primary: { ring: "border-primary/30", bg: "bg-primary-container/30", text: "text-primary", num: "bg-primary text-on-primary" },
  secondary: { ring: "border-secondary/30", bg: "bg-secondary-container/30", text: "text-secondary", num: "bg-secondary text-on-secondary" },
  tertiary: { ring: "border-tertiary/30", bg: "bg-tertiary-container/30", text: "text-tertiary", num: "bg-tertiary text-on-tertiary" },
};

export default function GroundingPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = intro, 1-5 = steps, 6 = final
  const logged = useRef(false);

  if (step === 6 && !logged.current) {
    logged.current = true;
    logResidentActivity({ quadrant: "mind", activityType: "grounding" });
  }

  if (step === 6) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
        <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
        </div>
        <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 leading-relaxed">
          {t("grounding.final")}
        </h2>
        <button
          onClick={() => router.push("/resident/home")}
          className="px-8 py-4 bg-primary text-on-primary rounded-xl font-bold text-sm uppercase tracking-widest"
        >
          {t("grounding.done")}
        </button>
      </div>
    );
  }

  if (step === 0) {
    return (
      <div className="max-w-lg mx-auto px-5 py-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-4xl">anchor</span>
        </div>
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">{t("grounding.title")}</h1>
        <p className="text-on-surface-variant text-sm mb-10">{t("grounding.subtitle")}</p>

        <div className="w-full space-y-3 mb-10">
          {STEPS.map((s, i) => {
            const c = COLOR_CLASSES[s.color];
            return (
              <div key={i} className={`flex items-center gap-4 rounded-xl p-4 border ${c.ring} ${c.bg}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${c.num}`}>
                  {s.num}
                </div>
                <span className={`font-semibold text-sm ${c.text}`}>{t(s.numKey)}</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setStep(1)}
          className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-sm uppercase tracking-widest"
        >
          {t("grounding.next")}
        </button>
      </div>
    );
  }

  const current = STEPS[step - 1];
  const c = COLOR_CLASSES[current.color];

  return (
    <div className="max-w-lg mx-auto px-5 py-10 flex flex-col items-center text-center">
      {/* Progress dots */}
      <div className="flex gap-2 mb-10">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i + 1 === step ? "w-8 bg-primary" : i + 1 < step ? "w-2 bg-primary/40" : "w-2 bg-outline-variant"
            }`}
          />
        ))}
      </div>

      {/* Big number */}
      <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-8 ${c.bg} border-2 ${c.ring}`}>
        <span className={`font-headline text-6xl font-bold ${c.text}`}>{current.num}</span>
      </div>

      {/* Icon */}
      <span className={`material-symbols-outlined text-4xl mb-4 ${c.text}`} style={{ fontVariationSettings: "'FILL' 1" }}>
        {current.icon}
      </span>

      <h2 className="font-headline text-2xl font-bold text-on-surface mb-3">{t(current.numKey)}</h2>
      <p className="text-on-surface-variant text-base leading-relaxed mb-12 max-w-sm">{t(current.descKey)}</p>

      <button
        onClick={() => setStep(step + 1)}
        className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest ${c.num}`}
      >
        {step === 5 ? t("grounding.done") : t("grounding.next")}
      </button>
    </div>
  );
}
