"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGES, type Lang } from "@/lib/i18n";

const LANG_KEY = "bloom_lang";
const ID_KEY = "bloom_kiosk_identifier";

export default function WelcomePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"lang" | "id">("lang");
  const [lang, setLangState] = useState<Lang>("en");
  const [bloomId, setBloomId] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as Lang | null;
    if (saved) setLangState(saved);
  }, []);

  const pickLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
    const isRtl = LANGUAGES.find((x) => x.code === l)?.rtl ?? false;
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", l);
    setPhase("id");
  };

  const proceed = (withId: boolean) => {
    if (withId && bloomId.trim()) {
      sessionStorage.setItem(ID_KEY, bloomId.trim());
    } else {
      sessionStorage.removeItem(ID_KEY);
    }
    router.push("/resident/home");
  };

  const T = (en: string, fr: string, es: string, ar: string, pa: string) => {
    const map: Record<Lang, string> = { en, fr, es, ar, pa, zh: en, tl: en, fa: en, hi: en, vi: en, ko: en };
    return map[lang] ?? en;
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-background px-6"
      dir={LANGUAGES.find((x) => x.code === lang)?.rtl ? "rtl" : "ltr"}
    >
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
        </div>
        <h1 className="font-headline text-4xl text-primary font-bold">Bloom</h1>
        <p className="text-on-surface-variant text-sm mt-1 tracking-wider uppercase font-medium">
          {T("Wellness Sanctuary", "Sanctuaire de Bien-être", "Santuario de Bienestar", "ملاذ العافية", "ਤੰਦਰੁਸਤੀ ਅਸਥਾਨ")}
        </p>
      </div>

      {phase === "lang" ? (
        <div className="w-full max-w-sm space-y-4">
          <h2 className="font-headline text-2xl text-center text-on-surface font-semibold mb-6">
            {T("Choose your language", "Choisissez votre langue", "Elige tu idioma", "اختاري لغتك", "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => pickLang(l.code)}
                className={`py-3 px-4 rounded-xl border-2 text-left transition-all duration-200 active:scale-95 ${
                  lang === l.code
                    ? "border-primary bg-primary-container/40 text-primary"
                    : "border-outline-variant/40 bg-surface-container-low hover:border-primary/40"
                }`}
              >
                <p className="font-semibold text-sm text-on-surface">{l.nativeLabel}</p>
                <p className="text-xs text-on-surface-variant">{l.label}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-6 text-center">
          <div>
            <h2 className="font-headline text-2xl text-on-surface font-semibold mb-2">
              {T("Enter your Bloom ID", "Entrez votre identifiant", "Ingresa tu ID", "أدخلي معرف Bloom", "Bloom ID ਦਾਖਲ ਕਰੋ")}
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {T(
                "Staff may have given you a Bloom ID or name. Enter it to save your activities, or skip to continue as a guest.",
                "Le personnel vous a peut-être donné un ID. Entrez-le pour sauvegarder vos activités, ou passez.",
                "El personal puede haberte dado un ID. Ingrésalo para guardar actividades, o sáltalo.",
                "ربما أعطاكِ الموظفون معرفاً. أدخليه لحفظ أنشطتك، أو تخطي.",
                "ਸਟਾਫ਼ ਨੇ ਤੁਹਾਨੂੰ ID ਦਿੱਤਾ ਹੋਵੇਗਾ। ਗਤੀਵਿਧੀਆਂ ਸੁਰੱਖਿਅਤ ਕਰਨ ਲਈ ਦਾਖਲ ਕਰੋ।"
              )}
            </p>
          </div>

          <input
            type="text"
            value={bloomId}
            onChange={(e) => setBloomId(e.target.value)}
            placeholder="BLM-XXXXX or your name"
            className="w-full px-5 py-4 rounded-xl border border-outline-variant/40 bg-white text-center text-lg focus:ring-2 focus:ring-primary/30 outline-none"
            autoComplete="off"
          />

          <div className="flex flex-col gap-3">
            <button
              onClick={() => proceed(true)}
              disabled={!bloomId.trim()}
              className="w-full py-4 bg-primary text-on-primary rounded-xl font-semibold text-base transition-opacity disabled:opacity-40 active:scale-[0.98]"
            >
              {T("Continue with my ID", "Continuer avec mon ID", "Continuar con mi ID", "المتابعة بمعرفي", "ਮੇਰੀ ID ਨਾਲ ਜਾਰੀ ਰੱਖੋ")}
            </button>
            <button
              onClick={() => proceed(false)}
              className="w-full py-4 border-2 border-primary/30 text-primary rounded-xl font-semibold text-base bg-white active:scale-[0.98]"
            >
              {T("Continue as guest", "Continuer en tant qu'invité", "Continuar como invitada", "المتابعة كضيفة", "ਮਹਿਮਾਨ ਵਜੋਂ ਜਾਰੀ ਰੱਖੋ")}
            </button>
            <button onClick={() => setPhase("lang")} className="text-sm text-on-surface-variant underline">
              ← {T("Change language", "Changer de langue", "Cambiar idioma", "تغيير اللغة", "ਭਾਸ਼ਾ ਬਦਲੋ")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
