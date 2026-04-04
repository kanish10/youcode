"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getStoredKioskIdentifier,
  logKioskActivity,
  setStoredKioskIdentifier,
} from "@/lib/kioskActivity";

type Step = "welcome" | "home" | "breathing" | "grounding" | "body" | "soul" | "message";

const GROUNDING = [
  "Name 5 things you can see",
  "Name 4 things you can touch",
  "Name 3 things you can hear",
  "Name 2 things you can smell",
  "Name 1 thing you can taste",
  "You are here. You are safe. You are present.",
];

export default function TabletKioskPage() {
  const [step, setStep] = useState<Step>("welcome");
  const [idInput, setIdInput] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const idForLog = useCallback(() => getStoredKioskIdentifier(), []);

  const finishActivity = async (
    quadrant: "mind" | "body" | "soul" | "connect",
    activityType: string,
    durationSeconds: number,
    addFlower: boolean,
    colorHex?: string
  ) => {
    setErr(null);
    const res = await logKioskActivity({
      identifier: idForLog(),
      quadrant,
      activityType,
      durationSeconds,
      addFlower,
      colorHex,
    });
    if (!res.ok) {
      setErr(res.error ?? "Could not save. You can still keep going.");
    } else {
      setMsg(
        res.anonymous
          ? "Thank you — your moment of wellness is counted."
          : "Saved to your Bloom journey."
      );
    }
    setStep("message");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-outline-variant/15 bg-surface-container/80 backdrop-blur px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl text-primary">Bloom</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">
            Shelter wellness · Tablet
          </p>
        </div>
        {step !== "welcome" && (
          <button
            type="button"
            onClick={() => {
              setStep("welcome");
              setMsg(null);
              setErr(null);
            }}
            className="text-sm text-primary font-semibold px-4 py-2 rounded-lg hover:bg-primary-container/30"
          >
            Change ID / guest
          </button>
        )}
      </header>

      <main className="flex-1 p-8 max-w-3xl mx-auto w-full">
        {step === "welcome" && (
          <WelcomeStep
            idInput={idInput}
            setIdInput={setIdInput}
            onWithId={() => {
              setStoredKioskIdentifier(idInput);
              setStep("home");
            }}
            onWithoutId={() => {
              setStoredKioskIdentifier("");
              setStep("home");
            }}
          />
        )}

        {step === "home" && (
          <HomeStep
            hasId={!!getStoredKioskIdentifier().trim()}
            displayId={getStoredKioskIdentifier()}
            onPick={(s) => {
              setMsg(null);
              setErr(null);
              setStep(s);
            }}
          />
        )}

        {step === "breathing" && (
          <BreathingStep
            onBack={() => setStep("home")}
            onComplete={(sec) =>
              finishActivity("mind", "breathing", sec, true, "#52695e")
            }
          />
        )}

        {step === "grounding" && (
          <GroundingStep
            onBack={() => setStep("home")}
            onComplete={() => finishActivity("mind", "grounding", 180, true, "#52695e")}
          />
        )}

        {step === "body" && (
          <TimerStep
            title="Gentle movement"
            subtitle="Move in whatever way feels kind to your body today."
            seconds={120}
            onBack={() => setStep("home")}
            onComplete={(sec) =>
              finishActivity("body", "gentle_movement", sec, true, "#A89B8F")
            }
          />
        )}

        {step === "soul" && (
          <SoulStep
            onBack={() => setStep("home")}
            onComplete={() => finishActivity("soul", "gratitude_moment", 0, true, "#6b6077")}
          />
        )}

        {step === "message" && (
          <div className="text-center space-y-6 py-12">
            {msg && <p className="text-xl font-headline text-primary">{msg}</p>}
            {err && <p className="text-error text-sm">{err}</p>}
            <button
              type="button"
              onClick={() => {
                setMsg(null);
                setErr(null);
                setStep("home");
              }}
              className="px-10 py-4 bg-primary text-white rounded-xl font-semibold"
            >
              Back to activities
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function WelcomeStep({
  idInput,
  setIdInput,
  onWithId,
  onWithoutId,
}: {
  idInput: string;
  setIdInput: (v: string) => void;
  onWithId: () => void;
  onWithoutId: () => void;
}) {
  return (
    <div className="space-y-8 text-center pt-8">
      <h2 className="font-headline text-4xl text-on-surface">Welcome</h2>
      <p className="text-on-surface-variant leading-relaxed max-w-lg mx-auto">
        If you have a <strong>Bloom ID</strong> or the name staff uses for you, enter it below so
        completed activities can show up in your personal log. If you don&apos;t remember, tap{" "}
        <em>Continue without my ID</em> — everything still works; we just won&apos;t attach it to a
        profile.
      </p>
      <input
        type="text"
        value={idInput}
        onChange={(e) => setIdInput(e.target.value)}
        placeholder="Bloom ID or name (optional)"
        className="w-full max-w-md mx-auto block px-5 py-4 rounded-xl border border-outline-variant/30 bg-white text-center text-lg"
        autoComplete="off"
      />
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
        <button
          type="button"
          onClick={onWithId}
          className="px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg"
        >
          Continue with my ID
        </button>
        <button
          type="button"
          onClick={onWithoutId}
          className="px-8 py-4 border-2 border-primary/30 text-primary rounded-xl font-semibold text-lg bg-white"
        >
          I don&apos;t remember — continue without ID
        </button>
      </div>
    </div>
  );
}

function HomeStep({
  hasId,
  displayId,
  onPick,
}: {
  hasId: boolean;
  displayId: string;
  onPick: (s: Step) => void;
}) {
  return (
    <div className="space-y-8">
      <div
        className={`rounded-2xl px-6 py-4 text-center ${
          hasId ? "bg-primary-container/40 text-primary-on-container" : "bg-secondary-container/40 text-on-secondary-container"
        }`}
      >
        <p className="text-sm font-bold uppercase tracking-widest">
          {hasId ? "Logging activities for" : "Guest mode"}
        </p>
        <p className="text-lg font-headline mt-1">
          {hasId ? displayId : "Activities are counted without a personal profile."}
        </p>
      </div>

      <h2 className="font-headline text-3xl text-center text-on-surface">Choose a practice</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ActivityCard
          icon="psychology"
          title="Mind · Breathing"
          desc="Follow a calm rhythm with Bloom."
          onClick={() => onPick("breathing")}
          tint="primary"
        />
        <ActivityCard
          icon="pan_tool"
          title="Mind · Grounding"
          desc="5-4-3-2-1 to come back to the present."
          onClick={() => onPick("grounding")}
          tint="primary"
        />
        <ActivityCard
          icon="fitness_center"
          title="Body · Gentle movement"
          desc="Two minutes of easy movement."
          onClick={() => onPick("body")}
          tint="secondary"
        />
        <ActivityCard
          icon="auto_awesome"
          title="Soul · Gratitude"
          desc="A short moment of thanks."
          onClick={() => onPick("soul")}
          tint="tertiary"
        />
      </div>
    </div>
  );
}

function ActivityCard({
  icon,
  title,
  desc,
  onClick,
  tint,
}: {
  icon: string;
  title: string;
  desc: string;
  onClick: () => void;
  tint: "primary" | "secondary" | "tertiary";
}) {
  const bg =
    tint === "primary"
      ? "bg-primary-container/25 hover:bg-primary-container/40"
      : tint === "secondary"
        ? "bg-secondary-container/35 hover:bg-secondary-container/50"
        : "bg-tertiary-container/25 hover:bg-tertiary-container/40";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${bg} rounded-2xl p-8 text-left border border-outline-variant/10 transition-all hover:shadow-md flex flex-col gap-3`}
    >
      <span className="material-symbols-outlined text-4xl text-primary">{icon}</span>
      <span className="font-headline text-xl text-on-surface">{title}</span>
      <span className="text-sm text-on-surface-variant">{desc}</span>
    </button>
  );
}

function BreathingStep({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: (seconds: number) => void;
}) {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const phase = Math.floor(sec / 4) % 2 === 0;
  return (
    <div className="space-y-8 text-center py-6">
      <button type="button" onClick={onBack} className="text-primary text-sm font-semibold self-start">
        ← Back
      </button>
      <p className="text-2xl font-headline text-primary">{phase ? "Breathe in…" : "Breathe out…"}</p>
      <div
        className="mx-auto w-40 h-40 rounded-full bg-primary-container/50 flex items-center justify-center flower-sway"
        style={{ animationDuration: "8s" }}
      >
        <span className="material-symbols-outlined text-6xl text-primary">air</span>
      </div>
      <p className="text-on-surface-variant">{sec}s</p>
      <button
        type="button"
        onClick={() => onComplete(sec)}
        className="px-8 py-4 bg-primary text-white rounded-xl font-semibold"
      >
        I&apos;m done
      </button>
    </div>
  );
}

function GroundingStep({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [i, setI] = useState(0);
  const done = i >= GROUNDING.length - 1;
  return (
    <div className="space-y-8 py-6">
      <button type="button" onClick={onBack} className="text-primary text-sm font-semibold">
        ← Back
      </button>
      <p className="text-4xl text-center text-primary font-light">{i < 5 ? 5 - i : "✓"}</p>
      <p className="text-xl text-center font-headline text-on-surface px-4">{GROUNDING[i]}</p>
      <button
        type="button"
        onClick={() => {
          if (done) onComplete();
          else setI((x) => x + 1);
        }}
        className="w-full py-4 bg-primary text-white rounded-xl font-semibold"
      >
        {done ? "Complete" : "Next"}
      </button>
    </div>
  );
}

function TimerStep({
  title,
  subtitle,
  seconds,
  onBack,
  onComplete,
}: {
  title: string;
  subtitle: string;
  seconds: number;
  onBack: () => void;
  onComplete: (elapsed: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="space-y-8 py-6 text-center">
      <button type="button" onClick={onBack} className="text-primary text-sm font-semibold">
        ← Back
      </button>
      <h3 className="font-headline text-3xl text-on-surface">{title}</h3>
      <p className="text-on-surface-variant">{subtitle}</p>
      <p className="text-5xl font-light text-primary">{elapsed}s</p>
      <p className="text-sm text-on-surface-variant">Suggested {seconds}s — finish anytime</p>
      <button
        type="button"
        onClick={() => onComplete(elapsed)}
        className="px-8 py-4 bg-secondary text-white rounded-xl font-semibold"
      >
        Finish
      </button>
    </div>
  );
}

function SoulStep({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-8 py-6 text-center">
      <button type="button" onClick={onBack} className="text-primary text-sm font-semibold">
        ← Back
      </button>
      <h3 className="font-headline text-3xl text-tertiary">Gratitude moment</h3>
      <p className="text-on-surface-variant max-w-md mx-auto">
        Think of one small thing that was okay today — a sound, a person, a sip of water. When
        you&apos;re ready, tap below.
      </p>
      <button
        type="button"
        onClick={onComplete}
        className="px-8 py-4 bg-tertiary text-white rounded-xl font-semibold"
      >
        I&apos;ve had my moment
      </button>
    </div>
  );
}
