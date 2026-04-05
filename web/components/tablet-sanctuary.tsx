"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isTextUIPart, type UIMessage } from "ai";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  CATEGORIES,
  EXERCISES,
  TINT_CLASSES,
  type Exercise,
  type ExerciseCategory,
} from "@/lib/exercises";
import {
  getStoredKioskIdentifier,
  logKioskActivity,
  setStoredKioskIdentifier,
} from "@/lib/kioskActivity";
import { LANGUAGES, type Lang } from "@/lib/i18n";

type Step =
  | "welcome"
  | "home"
  | "mind"
  | "breathing"
  | "grounding"
  | "body"
  | "exercise"
  | "soul"
  | "chat"
  | "message";

type CompletionNotice = {
  title: string;
  body: string;
  error?: string;
};

type DoodlePoint = {
  x: number;
  y: number;
};

type DoodleStroke = {
  points: DoodlePoint[];
  color: string;
  width: number;
};

const AFFIRMATIONS = [
  "You are allowed to move gently and still call it progress.",
  "Your nervous system deserves softness, not pressure.",
  "A small moment of care can still change the whole day.",
  "Your body, mind, and spirit all deserve room to breathe.",
  "Even a quiet practice is a meaningful act of strength.",
];

const SOUL_PROMPTS = [
  {
    title: "Gratitude seed",
    body: "Draw or write one small thing that brought steadiness today.",
  },
  {
    title: "Affirmation",
    body: "Let a colour or shape hold the feeling you want more of tonight.",
  },
  {
    title: "Memory",
    body: "Sketch a place, person, or moment that makes your shoulders soften.",
  },
];

const GROUNDING_STEPS = [
  {
    count: "5",
    title: "Notice what you can see",
    body: "Look for colours, edges, light, shadows, or anything steady in the room.",
    icon: "visibility",
    tone: "primary" as const,
  },
  {
    count: "4",
    title: "Notice what you can touch",
    body: "Feel the chair, your clothing, your feet on the floor, or your hands together.",
    icon: "back_hand",
    tone: "secondary" as const,
  },
  {
    count: "3",
    title: "Notice what you can hear",
    body: "Listen for distant sounds, close sounds, and the quiet underneath them.",
    icon: "hearing",
    tone: "tertiary" as const,
  },
  {
    count: "2",
    title: "Notice what you can smell",
    body: "If smell is hard to notice, imagine a scent that makes you feel safe.",
    icon: "air",
    tone: "primary" as const,
  },
  {
    count: "1",
    title: "Notice what you can taste",
    body: "Take a sip of water if you have it, or simply notice the taste already present.",
    icon: "restaurant",
    tone: "secondary" as const,
  },
];

const BREATH_SEQUENCE = [
  {
    label: "Inhale",
    description: "Breathe in through your nose and let your ribs widen.",
    seconds: 4,
  },
  {
    label: "Hold",
    description: "Pause softly. Keep your jaw and shoulders relaxed.",
    seconds: 4,
  },
  {
    label: "Exhale",
    description: "Breathe out slowly like you are fogging up a window.",
    seconds: 6,
  },
];

const PALETTE = ["#52695e", "#6d6258", "#6b6077", "#af3d3b", "#383833", "#bbb9b2"];
const BRUSH_SIZES = [3, 6, 10, 16];

const CATEGORY_LABELS: Record<ExerciseCategory | "all", string> = {
  all: "All practices",
  yoga: "Yoga",
  stretching: "Stretching",
  breathing: "Breathing",
  strength: "Strength",
  dance: "Dance",
};

const TONE_CLASSES = {
  primary: {
    badge: "bg-primary-container text-primary",
    card: "bg-primary-container/25 border-primary-fixed-dim/60",
    icon: "bg-primary text-white",
  },
  secondary: {
    badge: "bg-secondary-container text-secondary",
    card: "bg-secondary-container/25 border-secondary-fixed-dim/60",
    icon: "bg-secondary text-white",
  },
  tertiary: {
    badge: "bg-tertiary-container text-tertiary",
    card: "bg-tertiary-container/25 border-tertiary-fixed-dim/60",
    icon: "bg-tertiary text-white",
  },
};

function useVoiceInput(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    const BrowserSpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!BrowserSpeechRecognition) return;

    const recognition = new BrowserSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.lang = document.documentElement.lang || "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const supported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  return { isListening, startListening, stopListening, supported };
}

function formatClock(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function toCanvasPoint(
  event: ReactPointerEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
): DoodlePoint {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / rect.width,
    y: (event.clientY - rect.top) / rect.height,
  };
}

function drawStroke(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stroke: DoodleStroke
) {
  if (stroke.points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(stroke.points[0].x * width, stroke.points[0].y * height);
  stroke.points.slice(1).forEach((point) => {
    ctx.lineTo(point.x * width, point.y * height);
  });
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
}

export default function TabletSanctuary() {
  const [step, setStep] = useState<Step>("welcome");
  const [idInput, setIdInput] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [selectedExerciseId, setSelectedExerciseId] = useState(EXERCISES[0]?.id ?? "");
  const [notice, setNotice] = useState<CompletionNotice | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const [showLangPanel, setShowLangPanel] = useState(false);

  useEffect(() => {
    const savedIdentifier = getStoredKioskIdentifier();
    setIdentifier(savedIdentifier);
    setIdInput(savedIdentifier);
  }, []);

  const selectedExercise =
    EXERCISES.find((exercise) => exercise.id === selectedExerciseId) ?? EXERCISES[0];

  const goBack = useCallback(() => {
    if (step === "exercise") {
      setStep("body");
      return;
    }
    if (step === "breathing" || step === "grounding") {
      setStep("mind");
      return;
    }
    if (step === "message") {
      setNotice(null);
    }
    if (step !== "welcome") {
      setStep("home");
    }
  }, [step]);

  const finishActivity = useCallback(
    async (
      quadrant: "mind" | "body" | "soul" | "connect",
      activityType: string,
      durationSeconds: number,
      colorHex: string
    ) => {
      const result = await logKioskActivity({
        identifier,
        quadrant,
        activityType,
        durationSeconds,
        addFlower: quadrant !== "connect",
        colorHex,
      });

      if (!result.ok) {
        setNotice({
          title: "The practice is still yours.",
          body: "Bloom could not sync this moment to Supabase right now, but you can keep going without losing your flow.",
          error: result.error ?? "Sync failed.",
        });
      } else if (identifier.trim() && result.matched !== false) {
        setNotice({
          title: `Saved for ${identifier.trim()}`,
          body: "Your practice was added to this resident journey and reflected in the shared Bloom garden.",
        });
      } else if (identifier.trim()) {
        setNotice({
          title: "Saved as a guest moment",
          body: "That ID was not matched, so Bloom still counted the activity anonymously for the shelter garden.",
        });
      } else {
        setNotice({
          title: "Moment received",
          body: "Your practice was counted anonymously and helped the shelter garden bloom a little more.",
        });
      }

      setStep("message");
    },
    [identifier]
  );

  const pageTitle = {
    welcome: "Shelter tablet sanctuary",
    home: "Wellness Sanctuary",
    mind: "Mind practices",
    breathing: "Guided breathing",
    grounding: "Quiet grounding",
    body: "Movement library",
    exercise: selectedExercise?.name ?? "Body practice",
    soul: "Soul expression",
    chat: "Chat with Bloom",
    message: "Saved moment",
  }[step];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-on-surface">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,#cee9da_0%,rgba(206,233,218,0.35)_35%,transparent_72%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-secondary-container/35 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-96 w-96 rounded-full bg-tertiary-container/30 blur-3xl" />

      <header className="sticky top-0 z-20 border-b border-outline-variant/20 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {step !== "welcome" && (
              <button
                type="button"
                onClick={goBack}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/30 bg-white text-on-surface transition-colors hover:bg-surface-container"
                aria-label="Go back"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-2xl text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  spa
                </span>
                <span className="font-headline text-2xl font-bold text-primary">Bloom</span>
              </div>
              <p className="text-xs uppercase tracking-[0.22em] text-on-surface-variant">
                {pageTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {step !== "welcome" && (
              <>
                <div className="hidden rounded-full border border-outline-variant/20 bg-white px-4 py-2 text-sm text-on-surface-variant sm:block">
                  {identifier.trim() ? (
                    <>
                      Logging for <span className="font-semibold text-primary">{identifier}</span>
                    </>
                  ) : (
                    "Guest mode"
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIdInput(identifier);
                    setNotice(null);
                    setStep("welcome");
                  }}
                  className="rounded-full bg-surface-container px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary-container/60"
                >
                  Change ID
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setShowLangPanel(true)}
              className="flex items-center gap-1.5 rounded-full border border-outline-variant/20 bg-white px-4 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-lg">translate</span>
              <span className="font-medium uppercase">{lang}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {step === "welcome" && (
          <WelcomeStep
            idInput={idInput}
            onIdChange={setIdInput}
            onContinue={(withId) => {
              const nextIdentifier = withId ? idInput.trim() : "";
              setStoredKioskIdentifier(nextIdentifier);
              setIdentifier(nextIdentifier);
              setIdInput(nextIdentifier);
              setStep("home");
            }}
          />
        )}

        {step === "home" && (
          <HomeStep
            identifier={identifier}
            onOpenMind={() => setStep("mind")}
            onOpenBody={() => setStep("body")}
            onOpenSoul={() => setStep("soul")}
            onOpenChat={() => setStep("chat")}
          />
        )}

        {step === "mind" && (
          <MindStep
            onOpenBreathing={() => setStep("breathing")}
            onOpenGrounding={() => setStep("grounding")}
            onOpenChat={() => setStep("chat")}
          />
        )}

        {step === "breathing" && (
          <BreathingPractice
            onComplete={(seconds) =>
              finishActivity("mind", "breathing", seconds, "#52695e")
            }
          />
        )}

        {step === "grounding" && (
          <GroundingPractice
            onComplete={(seconds) =>
              finishActivity("mind", "grounding", seconds, "#52695e")
            }
          />
        )}

        {step === "body" && (
          <BodyLibrary
            onOpenExercise={(exercise) => {
              setSelectedExerciseId(exercise.id);
              setStep("exercise");
            }}
          />
        )}

        {step === "exercise" && selectedExercise && (
          <ExerciseStudio
            exercise={selectedExercise}
            onComplete={(exercise) =>
              finishActivity(
                "body",
                exercise.id,
                Math.max(exercise.durationMin * 60, 60),
                "#A89B8F"
              )
            }
          />
        )}

        {step === "soul" && (
          <SoulStudio
            onComplete={(seconds) =>
              finishActivity("soul", "soul_expression", seconds, "#6b6077")
            }
          />
        )}

        {step === "chat" && <ChatCompanion identifier={identifier} />}

        {step === "message" && notice && (
          <MessageStep notice={notice} onBackHome={() => setStep("home")} />
        )}
      </main>

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
                <h3 className="font-headline text-lg font-semibold text-on-surface">Choose your language</h3>
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
    </div>
  );
}

function WelcomeStep({
  idInput,
  onIdChange,
  onContinue,
}: {
  idInput: string;
  onIdChange: (value: string) => void;
  onContinue: (withId: boolean) => void;
}) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="space-y-6">
        <span className="inline-flex rounded-full bg-primary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
          Shared shelter sanctuary
        </span>
        <div className="space-y-4">
          <h1 className="font-headline text-5xl leading-tight text-on-surface">
            Quiet care for mind, body, soul, and conversation.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant">
            This tablet now includes the richer Bloom sanctuary flow: guided grounding,
            movement videos, a creative doodle studio, and a chat space with voice input.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <FeatureChip icon="psychology" label="Mind practices" />
          <FeatureChip icon="play_circle" label="Exercise videos" />
          <FeatureChip icon="draw" label="Soul doodles" />
        </div>
      </div>

      <div className="rounded-[2rem] border border-outline-variant/20 bg-white/90 p-8 shadow-[0_24px_80px_rgba(82,105,94,0.12)] backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container text-primary">
            <span className="material-symbols-outlined">badge</span>
          </div>
          <div>
            <h2 className="font-headline text-2xl text-on-surface">Optional Bloom ID</h2>
            <p className="text-sm text-on-surface-variant">
              Add an ID if staff gave you one, or continue in guest mode.
            </p>
          </div>
        </div>

        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          Bloom ID or name
        </label>
        <input
          type="text"
          value={idInput}
          onChange={(event) => onIdChange(event.target.value)}
          placeholder="BLM-1024 or your name"
          autoComplete="off"
          className="w-full rounded-2xl border border-outline-variant/30 bg-surface-container-low px-5 py-4 text-lg text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
        />

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => onContinue(true)}
            disabled={!idInput.trim()}
            className="w-full rounded-2xl bg-primary px-5 py-4 text-base font-semibold text-white transition-transform hover:bg-primary-dim disabled:cursor-not-allowed disabled:opacity-45"
          >
            Continue with my ID
          </button>
          <button
            type="button"
            onClick={() => onContinue(false)}
            className="w-full rounded-2xl border border-primary/25 bg-primary-container/15 px-5 py-4 text-base font-semibold text-primary transition-colors hover:bg-primary-container/35"
          >
            Continue as a guest
          </button>
        </div>
      </div>
    </section>
  );
}

function HomeStep({
  identifier,
  onOpenMind,
  onOpenBody,
  onOpenSoul,
  onOpenChat,
}: {
  identifier: string;
  onOpenMind: () => void;
  onOpenBody: () => void;
  onOpenSoul: () => void;
  onOpenChat: () => void;
}) {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-[2rem] border border-outline-variant/20 bg-white/80 p-8 shadow-[0_20px_70px_rgba(82,105,94,0.08)] md:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <span className="inline-flex rounded-full bg-tertiary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-tertiary">
            Wellness Sanctuary
          </span>
          <h1 className="font-headline text-5xl leading-tight text-on-surface">
            Choose the kind of support that feels right right now.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant">
            Explore calming mind practices, movement with embedded YouTube guidance,
            creative soul expression, or chat with Bloom using voice or text.
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-[1.75rem] bg-surface-container p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              Current session
            </p>
            <p className="mt-3 font-headline text-3xl text-primary">
              {identifier.trim() ? identifier : "Guest mode"}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
              {identifier.trim()
                ? "Practices completed here can sync to the same Supabase-backed Bloom journey used across the mobile app and web app."
                : "You can use every sanctuary tool without an ID. Bloom will count it anonymously for the shelter garden."}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-primary-container/35 px-4 py-3 text-sm text-on-primary-container">
            <span className="material-symbols-outlined text-primary">mic</span>
            Voice input is ready in the chat space on supported browsers.
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-4 md:grid-cols-2">
        <SanctuaryCard
          icon="psychology"
          eyebrow="Mind"
          title="Grounding and breath"
          description="Slow the room down with guided breathing or a 5-4-3-2-1 grounding flow."
          accent="primary"
          cta="Open mind"
          onClick={onOpenMind}
        />
        <SanctuaryCard
          icon="play_circle"
          eyebrow="Body"
          title={`${EXERCISES.length} guided movement practices`}
          description="Browse gentle yoga, stretching, seated strength, and movement with YouTube support."
          accent="secondary"
          cta="Open body"
          onClick={onOpenBody}
        />
        <SanctuaryCard
          icon="draw"
          eyebrow="Soul"
          title="Affirmation and doodle canvas"
          description="Pick colours, draw freely, and complete the same expressive studio the mobile app offers."
          accent="tertiary"
          cta="Open soul"
          onClick={onOpenSoul}
        />
        <SanctuaryCard
          icon="chat"
          eyebrow="Companion"
          title="Chat or speak with Bloom"
          description="Type, talk into the mic, and get gentle wellness support in the moment."
          accent="primary"
          cta="Open chat"
          onClick={onOpenChat}
        />
      </section>
    </div>
  );
}

function MindStep({
  onOpenBreathing,
  onOpenGrounding,
  onOpenChat,
}: {
  onOpenBreathing: () => void;
  onOpenGrounding: () => void;
  onOpenChat: () => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
          <span className="inline-flex rounded-full bg-primary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Mind sanctuary
          </span>
          <h1 className="mt-4 font-headline text-4xl text-on-surface">
            A few quiet ways to come back to yourself.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">
            These practices are designed for shelter spaces: low-pressure, accessible,
            and easy to do sitting down or wherever you are.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <PracticeCard
            icon="air"
            title="Guided breathing"
            description="Follow Bloom through a soft inhale-hold-exhale rhythm."
            accent="primary"
            onClick={onOpenBreathing}
          />
          <PracticeCard
            icon="anchor"
            title="Quiet grounding"
            description="Move through the 5-4-3-2-1 exercise at your own pace."
            accent="secondary"
            onClick={onOpenGrounding}
          />
          <PracticeCard
            icon="chat"
            title="Talk it through"
            description="If the mind feels loud, Bloom can listen by text or voice."
            accent="tertiary"
            onClick={onOpenChat}
          />
          <div className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              Daily reminder
            </p>
            <p className="mt-4 font-headline text-2xl leading-snug text-on-surface">
              “You do not have to solve everything before you take one steady breath.”
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-outline-variant/20 bg-surface-container p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          What’s here now
        </p>
        <div className="mt-6 space-y-4">
          {[
            "Guided pacing instead of countdown pressure",
            "Seated-friendly prompts for shared spaces",
            "A direct handoff into chat when support needs words",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 text-sm text-on-surface"
            >
              <span
                className="material-symbols-outlined rounded-full bg-primary-container p-2 text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check
              </span>
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BreathingPractice({
  onComplete,
}: {
  onComplete: (seconds: number) => void;
}) {
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(BREATH_SEQUENCE[0].seconds);
  const [elapsed, setElapsed] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!running) return;

    const timer = window.setInterval(() => {
      setElapsed((current) => current + 1);
      setSecondsLeft((current) => {
        if (current > 1) return current - 1;

        setPhaseIndex((currentPhase) => {
          const nextPhase = (currentPhase + 1) % BREATH_SEQUENCE.length;
          if (nextPhase === 0) {
            setCycles((currentCycles) => currentCycles + 1);
          }
          return nextPhase;
        });
        return BREATH_SEQUENCE[(phaseIndex + 1) % BREATH_SEQUENCE.length].seconds;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phaseIndex, running]);

  useEffect(() => {
    setSecondsLeft(BREATH_SEQUENCE[phaseIndex].seconds);
  }, [phaseIndex]);

  const phase = BREATH_SEQUENCE[phaseIndex];
  const phaseProgress =
    1 - secondsLeft / Math.max(BREATH_SEQUENCE[phaseIndex].seconds, 1);
  const orbScale =
    phase.label === "Inhale"
      ? 0.78 + phaseProgress * 0.28
      : phase.label === "Hold"
        ? 1.06
        : 1.06 - phaseProgress * 0.28;

  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
        <span className="inline-flex rounded-full bg-primary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
          Guided breathing
        </span>
        <h1 className="mt-4 font-headline text-4xl text-on-surface">
          Let the circle set the pace.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">
          This follows a gentle inhale, pause, and slow release. You can stop,
          restart, or finish whenever the body feels settled enough.
        </p>

        <div className="mt-10 flex items-center justify-center">
          <div className="relative flex h-80 w-80 items-center justify-center rounded-full bg-primary-container/35">
            <div
              className="flex h-52 w-52 items-center justify-center rounded-full bg-primary text-center text-white shadow-[0_20px_60px_rgba(82,105,94,0.30)] transition-transform duration-1000"
              style={{ transform: `scale(${orbScale})` }}
            >
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/70">
                  {phase.label}
                </p>
                <p className="mt-2 font-headline text-5xl">{secondsLeft}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 rounded-[1.5rem] bg-surface-container p-5 md:grid-cols-3">
          <InfoStat label="Elapsed" value={formatClock(elapsed)} />
          <InfoStat label="Cycles" value={`${cycles}`} />
          <InfoStat label="Current cue" value={phase.label} />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-[2rem] border border-outline-variant/20 bg-surface-container p-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            Current guidance
          </p>
          <h2 className="mt-4 font-headline text-3xl text-on-surface">{phase.label}</h2>
          <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
            {phase.description}
          </p>

          <div className="mt-6 space-y-3">
            {BREATH_SEQUENCE.map((item, index) => (
              <div
                key={item.label}
                className={`rounded-2xl border px-4 py-4 ${
                  index === phaseIndex
                    ? "border-primary/30 bg-primary-container/35"
                    : "border-outline-variant/20 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-on-surface">{item.label}</span>
                  <span className="text-sm text-on-surface-variant">
                    {item.seconds}s
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-outline-variant/20 bg-white p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setRunning((current) => !current)}
              className="rounded-2xl bg-primary px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white"
            >
              {running ? "Pause practice" : elapsed > 0 ? "Resume practice" : "Start practice"}
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setPhaseIndex(0);
                setSecondsLeft(BREATH_SEQUENCE[0].seconds);
                setElapsed(0);
                setCycles(0);
              }}
              className="rounded-2xl border border-outline-variant/25 bg-surface-container px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-on-surface"
            >
              Reset
            </button>
          </div>
          <button
            type="button"
            onClick={() => onComplete(Math.max(elapsed, 60))}
            className="mt-3 w-full rounded-2xl border border-primary/20 bg-primary-container/30 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary"
          >
            Finish and save
          </button>
        </div>
      </div>
    </section>
  );
}

function GroundingPractice({
  onComplete,
}: {
  onComplete: (seconds: number) => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);

  const current = GROUNDING_STEPS[stepIndex];

  if (!current) {
    return (
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-outline-variant/20 bg-white/85 p-10 text-center shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-container text-primary">
          <span
            className="material-symbols-outlined text-4xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            spa
          </span>
        </div>
        <h1 className="mt-6 font-headline text-4xl text-on-surface">
          You are here. You are safe enough for this breath.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant">
          If the room feels a little more solid now, you can save this moment and return to the sanctuary.
        </p>
        <button
          type="button"
          onClick={() => onComplete(180)}
          className="mt-8 rounded-2xl bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white"
        >
          Save grounding moment
        </button>
      </section>
    );
  }

  const tone = TONE_CLASSES[current.tone];

  return (
    <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="rounded-[2rem] border border-outline-variant/20 bg-surface-container p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          Progress
        </p>
        <div className="mt-5 flex gap-2">
          {GROUNDING_STEPS.map((item, index) => (
            <div
              key={item.title}
              className={`h-2 flex-1 rounded-full ${
                index < stepIndex
                  ? "bg-primary/50"
                  : index === stepIndex
                    ? "bg-primary"
                    : "bg-outline-variant/40"
              }`}
            />
          ))}
        </div>
        <div className="mt-6 space-y-3">
          {GROUNDING_STEPS.map((item, index) => {
            const itemTone = TONE_CLASSES[item.tone];
            return (
              <div
                key={item.title}
                className={`rounded-2xl border px-4 py-4 ${
                  index === stepIndex ? itemTone.card : "border-outline-variant/15 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${itemTone.icon}`}
                  >
                    {item.count}
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface">{item.title}</p>
                    <p className="text-sm text-on-surface-variant">{item.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
        <div className="flex items-center gap-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${tone.icon}`}>
            <span className="material-symbols-outlined text-3xl">{current.icon}</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              Step {stepIndex + 1} of {GROUNDING_STEPS.length}
            </p>
            <h1 className="font-headline text-4xl text-on-surface">{current.count}</h1>
          </div>
        </div>

        <h2 className="mt-8 font-headline text-3xl text-on-surface">{current.title}</h2>
        <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">{current.body}</p>

        <div className="mt-8 rounded-[1.5rem] bg-surface-container p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            Gentle cue
          </p>
          <p className="mt-3 text-base leading-relaxed text-on-surface">
            Take your time. There is no perfect answer to this step. Even noticing one thing is enough.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={() => setStepIndex((currentIndex) => currentIndex - 1)}
              className="rounded-2xl border border-outline-variant/25 bg-surface-container px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-on-surface"
            >
              Previous
            </button>
          )}
          <button
            type="button"
            onClick={() => setStepIndex((currentIndex) => currentIndex + 1)}
            className="rounded-2xl bg-primary px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white"
          >
            {stepIndex === GROUNDING_STEPS.length - 1 ? "Complete grounding" : "Next step"}
          </button>
        </div>
      </div>
    </section>
  );
}

function BodyLibrary({
  onOpenExercise,
}: {
  onOpenExercise: (exercise: Exercise) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<ExerciseCategory | "all">("all");

  const filteredExercises =
    activeCategory === "all"
      ? EXERCISES
      : EXERCISES.filter((exercise) => exercise.category === activeCategory);

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
        <span className="inline-flex rounded-full bg-secondary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-secondary">
          Body sanctuary
        </span>
        <h1 className="mt-4 font-headline text-4xl text-on-surface">
          Movement with real exercises and video guidance.
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-on-surface-variant">
          The tablet now uses the same exercise library as the mobile app: yoga,
          stretching, breathing, strength, and movement with embedded YouTube search
          plus clear step-by-step instructions.
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {CATEGORIES.map((category) => {
          const selected = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                selected
                  ? "bg-primary text-white"
                  : "border border-outline-variant/25 bg-white text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-base">{category.icon}</span>
              {CATEGORY_LABELS[category.id]}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredExercises.map((exercise) => {
          const tint = TINT_CLASSES[exercise.tint];
          return (
            <button
              key={exercise.id}
              type="button"
              onClick={() => onOpenExercise(exercise)}
              className={`rounded-[1.75rem] border p-5 text-left transition-transform hover:-translate-y-0.5 ${tint.card}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${tint.icon}`}
                >
                  <span className="material-symbols-outlined text-3xl">{exercise.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${tint.badge}`}>
                      {exercise.difficulty}
                    </span>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                      {exercise.durationMin} min
                    </span>
                    {exercise.isSeated && (
                      <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                        Seated
                      </span>
                    )}
                  </div>
                  <h2 className="font-headline text-2xl text-on-surface">{exercise.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                    {exercise.desc}
                  </p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">
                  arrow_forward
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ExerciseStudio({
  exercise,
  onComplete,
}: {
  exercise: Exercise;
  onComplete: (exercise: Exercise) => void;
}) {
  const tint = TINT_CLASSES[exercise.tint];
  const youtubeEmbedUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
    exercise.youtubeQuery
  )}`;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    exercise.youtubeQuery
  )}`;

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.96fr]">
        <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-18 w-18 shrink-0 items-center justify-center rounded-[1.5rem] p-4 ${tint.icon}`}
            >
              <span className="material-symbols-outlined text-4xl">{exercise.icon}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${tint.badge}`}>
                  {exercise.difficulty}
                </span>
                <span className="rounded-full bg-surface-container px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                  {exercise.durationMin} min
                </span>
                {exercise.isSeated && (
                  <span className="rounded-full bg-surface-container px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                    Seated
                  </span>
                )}
              </div>
              <h1 className="font-headline text-4xl text-on-surface">{exercise.name}</h1>
              <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
                {exercise.desc}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {exercise.steps.map((step, index) => (
              <div
                key={`${exercise.id}-${index}`}
                className="flex items-start gap-4 rounded-2xl border border-outline-variant/15 bg-surface-container px-4 py-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-relaxed text-on-surface">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="overflow-hidden rounded-[2rem] border border-outline-variant/20 bg-black shadow-[0_20px_60px_rgba(56,56,51,0.10)]">
            <div className="relative w-full pb-[56.25%]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={youtubeEmbedUrl}
                title={`${exercise.name} YouTube search`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-[1.5rem] border p-5 ${tint.card}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF0000] text-white">
                  <span className="material-symbols-outlined">play_arrow</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                    Video fallback
                  </p>
                  <p className="font-semibold text-on-surface">Open on YouTube</p>
                </div>
              </div>
            </a>

            <button
              type="button"
              onClick={() => onComplete(exercise)}
              className={`rounded-[1.5rem] px-5 py-5 text-left ${tint.btn}`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/75">
                Finish practice
              </p>
              <p className="mt-1 font-semibold text-white">
                Save this movement to Bloom
              </p>
            </button>
          </div>

          <div className="rounded-[1.75rem] border border-outline-variant/20 bg-surface-container p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              Tip
            </p>
            <p className="mt-3 text-sm leading-relaxed text-on-surface">
              If the embedded video does not load in a shelter browser, the direct
              YouTube button above opens the same exercise search in a new tab.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SoulStudio({
  onComplete,
}: {
  onComplete: (seconds: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<DoodleStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<DoodleStroke | null>(null);
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const affirmation =
    AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length];

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, rect.width, rect.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, rect.width, rect.height);

    strokes.forEach((stroke) => drawStroke(context, rect.width, rect.height, stroke));
    if (currentStroke) {
      drawStroke(context, rect.width, rect.height, currentStroke);
    }
  }, [currentStroke, strokes]);

  useEffect(() => {
    redrawCanvas();
    window.addEventListener("resize", redrawCanvas);
    return () => window.removeEventListener("resize", redrawCanvas);
  }, [redrawCanvas]);

  useEffect(() => {
    if (!timerRunning) return;
    const timer = window.setInterval(() => {
      setTimerSeconds((current) => current + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning]);

  const beginStroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    const point = toCanvasPoint(event, canvas);
    setCurrentStroke({
      color: selectedColor,
      width: brushSize,
      points: [point],
    });
    setTimerRunning(true);
  };

  const continueStroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!currentStroke || !canvasRef.current) return;

    const point = toCanvasPoint(event, canvasRef.current);
    setCurrentStroke((existing) =>
      existing
        ? {
            ...existing,
            points: [...existing.points, point],
          }
        : existing
    );
  };

  const endStroke = () => {
    setCurrentStroke((existing) => {
      if (!existing) return null;
      const finishedStroke =
        existing.points.length === 1
          ? { ...existing, points: [...existing.points, existing.points[0]] }
          : existing;
      setStrokes((allStrokes) => [...allStrokes, finishedStroke]);
      return null;
    });
  };

  const hasDrawing = strokes.length > 0 || !!currentStroke;

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
        <span className="inline-flex rounded-full bg-tertiary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-tertiary">
          Soul studio
        </span>
        <h1 className="mt-4 font-headline text-4xl text-on-surface">
          Creative space, now with the doodle tool from mobile.
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-on-surface-variant">
          Sit with an affirmation, choose a colour, and draw anything that helps the
          moment move through you. The timer starts when your first stroke begins.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-outline-variant/20 bg-tertiary-container/40 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-tertiary">
              Daily affirmation
            </p>
            <p className="mt-4 font-headline text-3xl leading-snug text-on-tertiary-container">
              “{affirmation}”
            </p>
          </div>

          <div className="grid gap-4">
            {SOUL_PROMPTS.map((prompt) => (
              <div
                key={prompt.title}
                className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container px-5 py-5"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                  {prompt.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-on-surface">
                  {prompt.body}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[1.5rem] border border-outline-variant/20 bg-white px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                Reflection timer
              </p>
              <span className="rounded-full bg-tertiary-container px-4 py-2 text-sm font-semibold text-tertiary">
                {formatClock(timerSeconds)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
              The timer begins with the first stroke so quiet doodling still counts as a completed soul moment.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-outline-variant/20 bg-white/90 p-6 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-headline text-3xl text-on-surface">Digital doodle</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Express with colour, shape, or just a single line.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-surface-container px-4 py-2 text-sm font-semibold text-on-surface">
              <span className="material-symbols-outlined text-tertiary">timer</span>
              {formatClock(timerSeconds)}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-outline-variant/20 bg-surface-container p-4">
            <div className="flex flex-wrap items-center gap-2">
              {PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-8 w-8 rounded-full border-2 transition-transform ${
                    selectedColor === color
                      ? "scale-110 border-on-surface"
                      : "border-white"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select ${color}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              {BRUSH_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setBrushSize(size)}
                  className={`flex items-center justify-center rounded-full border bg-white ${
                    brushSize === size ? "border-primary" : "border-outline-variant/25"
                  }`}
                  style={{ width: size + 18, height: size + 18 }}
                  aria-label={`Brush size ${size}`}
                >
                  <span
                    className="rounded-full bg-on-surface-variant"
                    style={{ width: size, height: size }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="relative mt-5 overflow-hidden rounded-[1.5rem] border border-outline-variant/20 bg-white">
            <canvas
              ref={canvasRef}
              className="aspect-[16/10] w-full touch-none"
              onPointerDown={beginStroke}
              onPointerMove={continueStroke}
              onPointerUp={endStroke}
              onPointerLeave={endStroke}
            />
            {!hasDrawing && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl text-tertiary">
                  draw
                </span>
                <p className="max-w-xs text-sm leading-relaxed">
                  Tap and drag to begin drawing. This is private to the current session.
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setStrokes((existing) => existing.slice(0, -1));
              }}
              disabled={!strokes.length}
              className="rounded-2xl border border-outline-variant/25 bg-surface-container px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-on-surface disabled:opacity-40"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentStroke(null);
                setStrokes([]);
                setTimerRunning(false);
                setTimerSeconds(0);
              }}
              className="rounded-2xl border border-outline-variant/25 bg-surface-container px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-on-surface"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => onComplete(Math.max(timerSeconds, 60))}
              className="rounded-2xl bg-tertiary px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white"
            >
              Save soul moment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatCompanion({ identifier }: { identifier: string }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  const initialMessages = useMemo<UIMessage[]>(
    () => [
      {
        id: "greeting",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hi, I’m Bloom. You can type or use the mic, and we can talk through what you’re carrying right now.",
          },
        ],
      },
    ],
    []
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { bloomId: identifier.trim() || undefined },
      }),
    [identifier]
  );

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport,
    messages: initialMessages,
  });

  const handleVoiceResult = useCallback((text: string) => {
    setInputValue((current) => (current ? `${current} ${text}` : text));
  }, []);

  const {
    isListening,
    startListening,
    stopListening,
    supported: voiceSupported,
  } = useVoiceInput(handleVoiceResult);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (event: FormEvent) => {
    event.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue("");
    sendMessage({ text });
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
      <div className="space-y-5">
        <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
          <span className="inline-flex rounded-full bg-primary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Chat companion
          </span>
          <h1 className="mt-4 font-headline text-4xl text-on-surface">
            Type or speak with Bloom.
          </h1>
          <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
            The resident chat flow exists on web already, but the tablet now exposes it directly
            so residents can reach support without leaving the sanctuary.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container px-5 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              Voice input
            </p>
            <p className="mt-2 text-sm leading-relaxed text-on-surface">
              {voiceSupported
                ? "Tap the mic in the chat box to speak. Your words will be transcribed into the message field."
                : "This browser does not expose the microphone API, so chat falls back to typing only."}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container px-5 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              Session mode
            </p>
            <p className="mt-2 text-sm leading-relaxed text-on-surface">
              {identifier.trim()
                ? `Bloom will pass ${identifier.trim()} so the chat API can pull resident context when it is available.`
                : "No ID is attached, so Bloom responds in guest mode without personal history."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex h-[75vh] min-h-[620px] flex-col overflow-hidden rounded-[2rem] border border-outline-variant/20 bg-white/90 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
        <div className="flex items-center justify-between border-b border-outline-variant/20 px-6 py-5">
          <div>
            <h2 className="font-headline text-2xl text-on-surface">Bloom chat</h2>
            <p className="text-sm text-on-surface-variant">
              Gentle support in 2 to 4 sentences at a time.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMessages(initialMessages);
              setInputValue("");
            }}
            className="rounded-full bg-surface-container px-4 py-2 text-sm font-semibold text-primary"
          >
            Clear
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-surface-container-low px-5 py-5">
          {messages.map((message) => {
            const text = message.parts.filter(isTextUIPart).map((part) => part.text).join("");
            if (!text) return null;

            return (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-md bg-primary text-white"
                      : "rounded-bl-md border border-outline-variant/15 bg-white text-on-surface"
                  }`}
                >
                  {text}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-[1.5rem] rounded-bl-md border border-outline-variant/15 bg-white px-4 py-3 text-sm italic text-on-surface-variant">
                Bloom is thinking...
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-error-container/20 px-4 py-3 text-sm text-on-error-container">
              Bloom could not reply right now. Please try again in a moment.
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="flex items-center gap-3 border-t border-outline-variant/20 bg-white px-5 py-4"
        >
          {voiceSupported && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                isListening
                  ? "bg-error text-white"
                  : "bg-surface-container text-on-surface-variant"
              } disabled:opacity-45`}
              aria-label={isListening ? "Stop recording" : "Start voice input"}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isListening ? "stop" : "mic"}
              </span>
            </button>
          )}

          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder={
              isListening
                ? "Listening..."
                : "Tell Bloom how you are feeling or what support you want."
            }
            disabled={isLoading}
            className="flex-1 rounded-2xl border border-outline-variant/25 bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />

          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white disabled:opacity-40"
            aria-label="Send message"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              send
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}

function MessageStep({
  notice,
  onBackHome,
}: {
  notice: CompletionNotice;
  onBackHome: () => void;
}) {
  return (
    <section className="mx-auto max-w-3xl rounded-[2rem] border border-outline-variant/20 bg-white/85 p-10 text-center shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-container text-primary">
        <span
          className="material-symbols-outlined text-4xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
      </div>
      <h1 className="mt-6 font-headline text-4xl text-on-surface">{notice.title}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant">
        {notice.body}
      </p>
      {notice.error && (
        <p className="mx-auto mt-4 max-w-xl rounded-2xl bg-error-container/20 px-4 py-3 text-sm text-on-error-container">
          {notice.error}
        </p>
      )}
      <button
        type="button"
        onClick={onBackHome}
        className="mt-8 rounded-2xl bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white"
      >
        Back to sanctuary
      </button>
    </section>
  );
}

function SanctuaryCard({
  icon,
  eyebrow,
  title,
  description,
  accent,
  cta,
  onClick,
}: {
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: keyof typeof TONE_CLASSES;
  cta: string;
  onClick: () => void;
}) {
  const tone = TONE_CLASSES[accent];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[1.75rem] border p-6 text-left transition-transform hover:-translate-y-0.5 ${tone.card}`}
    >
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone.icon}`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-headline text-3xl leading-snug text-on-surface">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
        {description}
      </p>
      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
        {cta}
        <span className="material-symbols-outlined text-base">arrow_forward</span>
      </div>
    </button>
  );
}

function PracticeCard({
  icon,
  title,
  description,
  accent,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  accent: keyof typeof TONE_CLASSES;
  onClick: () => void;
}) {
  const tone = TONE_CLASSES[accent];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[1.5rem] border p-5 text-left transition-transform hover:-translate-y-0.5 ${tone.card}`}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone.icon}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h2 className="mt-4 font-headline text-2xl text-on-surface">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
        {description}
      </p>
    </button>
  );
}

function FeatureChip({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-outline-variant/20 bg-white/75 px-4 py-3 text-sm font-semibold text-on-surface">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      {label}
    </div>
  );
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-4">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        {label}
      </p>
      <p className="mt-2 font-headline text-3xl text-on-surface">{value}</p>
    </div>
  );
}
