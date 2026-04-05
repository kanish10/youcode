"use client";

import { use, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { EXERCISES, TINT_CLASSES } from "@/lib/exercises";
import { useRouter } from "next/navigation";

export default function ExerciseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, bloomId } = useLanguage();
  const router = useRouter();
  const [logged, setLogged] = useState(false);
  const [logging, setLogging] = useState(false);

  const ex = EXERCISES.find((e) => e.id === id);
  if (!ex) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
        <span className="material-symbols-outlined text-4xl text-outline mb-4">search_off</span>
        <p className="text-on-surface-variant mb-4">Exercise not found.</p>
        <button onClick={() => router.back()} className="text-primary font-semibold text-sm underline">
          {t("body.backToList")}
        </button>
      </div>
    );
  }

  const tint = TINT_CLASSES[ex.tint];
  const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.youtubeQuery)}`;
  const ytEmbedUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(ex.youtubeQuery)}`;

  const stepColors = ["primary", "secondary", "tertiary", "primary", "secondary", "tertiary", "primary", "secondary"];
  const stepTints = [
    "text-[10px] uppercase tracking-wider font-bold text-primary px-2 py-0.5 bg-primary-fixed rounded-full",
    "text-[10px] uppercase tracking-wider font-bold text-secondary px-2 py-0.5 bg-secondary-fixed rounded-full",
    "text-[10px] uppercase tracking-wider font-bold text-tertiary px-2 py-0.5 bg-tertiary-fixed rounded-full",
  ];

  async function handleLog() {
    setLogging(true);
    try {
      await fetch("/api/log-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quadrant: "body",
          activityType: ex!.id,
          durationSeconds: (ex!.durationMin ?? 5) * 60,
          identifier: bloomId || "",
          addFlower: true,
          colorHex: "#A89B8F",
        }),
      });
      setLogged(true);
    } catch {
      setLogged(true);
    } finally {
      setLogging(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-8 pb-32">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-primary font-semibold text-sm mb-6"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        {t("body.backToList")}
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${tint.icon}`}>
          <span className="material-symbols-outlined text-3xl">{ex.icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tint.badge}`}>
              {ex.difficulty}
            </span>
            <span className="text-[10px] font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              {ex.durationMin} {t("common.min")}
            </span>
            {ex.isSeated && (
              <span className="text-[10px] font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                {t("body.seatedLabel")}
              </span>
            )}
          </div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">{ex.name}</h1>
          <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{ex.desc}</p>
        </div>
      </div>

      {/* Embedded YouTube Video */}
      <div className="mb-6 rounded-2xl overflow-hidden border border-outline-variant/20 shadow-sm">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={ytEmbedUrl}
            title={ex.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* YouTube Search Fallback */}
      <a
        href={ytSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full mb-6 flex items-center gap-3 px-5 py-3 rounded-xl border ${tint.card} active:scale-[0.98] transition-transform`}
      >
        <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M21.8 8s-.2-1.4-.8-2c-.7-.8-1.5-.8-1.9-.9C16.8 5 12 5 12 5s-4.8 0-7.1.1c-.4.1-1.2.1-1.9.9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.7.8 1.6.7 2 .8C6.4 18.9 12 19 12 19s4.8 0 7.1-.2c.4 0 1.2-.1 1.9-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM10 15V9l6 3-6 3z"/></svg>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-xs text-on-surface">{t("body.watchOnYoutube")}</p>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant text-sm">open_in_new</span>
      </a>

      {/* Steps */}
      <div className="mb-8">
        <h2 className="font-headline text-lg font-semibold text-on-surface mb-4">{t("body.stepsTitle")}</h2>
        <div className="space-y-3">
          {ex.steps.map((step, i) => (
            <div
              key={i}
              className="bg-surface-container-low rounded-xl p-4 flex gap-3 items-start border border-outline-variant/20"
            >
              <span className={stepTints[i % 3]}>
                Step {i + 1}
              </span>
              <p className="text-sm text-on-surface leading-relaxed flex-1">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-16 left-0 right-0 px-5 pb-4 bg-gradient-to-t from-background via-background/90 to-transparent pt-6">
        <div className="max-w-lg mx-auto">
          {logged ? (
            <div className="w-full py-4 bg-primary-container rounded-xl flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-semibold text-primary">{t("common.done")}</span>
            </div>
          ) : (
            <button
              onClick={handleLog}
              disabled={logging}
              className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest active:scale-[0.98] transition-all ${tint.btn} disabled:opacity-50`}
            >
              {logging ? t("common.loading") : t("body.startPractice")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
