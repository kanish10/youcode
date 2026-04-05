"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  STORIES,
  LULLABIES,
  FEELINGS,
  COLORING_IDEAS,
  type KidStory,
  type Lullaby,
  type Feeling,
} from "@/lib/kids-content";

type View =
  | { kind: "home" }
  | { kind: "stories" }
  | { kind: "story"; story: KidStory }
  | { kind: "lullabies" }
  | { kind: "lullaby"; lullaby: Lullaby }
  | { kind: "feelings" }
  | { kind: "feeling"; feeling: Feeling }
  | { kind: "draw" }
  | { kind: "coloring" };

const KID_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#facc15", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
  "#a855f7", // purple
  "#ec4899", // pink
  "#000000", // black
];
const KID_BRUSH = 12;

export default function KidsCorner() {
  const [view, setView] = useState<View>({ kind: "home" });

  const back = () => setView({ kind: "home" });

  if (view.kind === "home") {
    return (
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
          <span className="inline-flex rounded-full bg-tertiary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-tertiary">
            Kids corner
          </span>
          <h1 className="mt-4 font-headline text-4xl text-on-surface">
            A quiet space for your little ones.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">
            Stories, lullabies, feelings cards, and gentle drawing — safe to
            hand to a child while you take 10 minutes for yourself.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KidCard
            emoji="📖"
            title="Story Time"
            description="Four short bedtime stories"
            onClick={() => setView({ kind: "stories" })}
            color="tertiary"
          />
          <KidCard
            emoji="🎵"
            title="Lullabies"
            description="Gentle songs from around the world"
            onClick={() => setView({ kind: "lullabies" })}
            color="primary"
          />
          <KidCard
            emoji="😊"
            title="How Do You Feel?"
            description="Tap a face to talk about feelings"
            onClick={() => setView({ kind: "feelings" })}
            color="secondary"
          />
          <KidCard
            emoji="🎨"
            title="Draw Something"
            description="A simple drawing space"
            onClick={() => setView({ kind: "draw" })}
            color="tertiary"
          />
          <KidCard
            emoji="🖨️"
            title="Coloring Pages"
            description="Ideas staff can print for you"
            onClick={() => setView({ kind: "coloring" })}
            color="primary"
          />
        </div>

        <div className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container p-5">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary">
              favorite
            </span>
            <p className="text-sm leading-relaxed text-on-surface">
              <span className="font-semibold text-on-surface">For moms:</span>{" "}
              Every minute you rest is good for your child too. You don&rsquo;t
              have to earn it.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (view.kind === "stories") {
    return (
      <ScreenShell title="Story Time" eyebrow="Pick a story" onBack={back} tone="tertiary">
        <div className="grid gap-4 sm:grid-cols-2">
          {STORIES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setView({ kind: "story", story: s })}
              className="flex items-center gap-4 rounded-2xl border border-outline-variant/20 bg-white/80 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-tertiary/30"
            >
              <span className="text-5xl leading-none">{s.emoji}</span>
              <div className="flex-1">
                <h3 className="font-headline text-xl text-on-surface">
                  {s.title}
                </h3>
                <p className="text-xs text-on-surface-variant">{s.readTime}</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">
                arrow_forward
              </span>
            </button>
          ))}
        </div>
      </ScreenShell>
    );
  }

  if (view.kind === "story") {
    return (
      <ScreenShell
        title={view.story.title}
        eyebrow="Story"
        onBack={() => setView({ kind: "stories" })}
        tone="tertiary"
      >
        <div className="rounded-[2rem] border border-tertiary/15 bg-tertiary-container/20 p-8">
          <div className="text-center text-7xl leading-none">
            {view.story.emoji}
          </div>
          <div className="mt-6 space-y-4">
            {view.story.paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-headline text-xl leading-relaxed text-on-surface"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm italic text-on-surface-variant">The end 🌸</p>
        </div>
      </ScreenShell>
    );
  }

  if (view.kind === "lullabies") {
    return (
      <ScreenShell title="Lullabies" eyebrow="Pick a song" onBack={back} tone="primary">
        <div className="grid gap-3 sm:grid-cols-2">
          {LULLABIES.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setView({ kind: "lullaby", lullaby: l })}
              className="flex items-center gap-4 rounded-2xl border border-outline-variant/20 bg-white/80 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30"
            >
              <span className="text-4xl leading-none">{l.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-headline text-lg text-on-surface truncate">
                  {l.title}
                </h3>
                <p className="text-xs text-on-surface-variant truncate">
                  {l.origin}
                </p>
              </div>
              <span className="material-symbols-outlined text-primary">
                play_circle
              </span>
            </button>
          ))}
        </div>
      </ScreenShell>
    );
  }

  if (view.kind === "lullaby") {
    const l = view.lullaby;
    const embedUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(l.youtubeQuery)}`;
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(l.youtubeQuery)}`;
    return (
      <ScreenShell
        title={l.title}
        eyebrow="Lullaby"
        onBack={() => setView({ kind: "lullabies" })}
        tone="primary"
      >
        <div className="overflow-hidden rounded-[1.5rem] border border-outline-variant/20 bg-black">
          <div className="relative w-full pb-[56.25%]">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={embedUrl}
              title={l.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-surface-container p-4 text-center">
          <p className="text-sm text-on-surface-variant">
            {l.origin}
          </p>
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-primary"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            Open on YouTube if the song doesn&rsquo;t load
          </a>
        </div>
      </ScreenShell>
    );
  }

  if (view.kind === "feelings") {
    return (
      <ScreenShell
        title="How do you feel?"
        eyebrow="Tap a face"
        onBack={back}
        tone="secondary"
      >
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {FEELINGS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setView({ kind: "feeling", feeling: f })}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-outline-variant/20 bg-white/80 p-4 transition-all hover:-translate-y-0.5 hover:border-secondary/40 hover:bg-secondary-container/20"
            >
              <span className="text-5xl leading-none">{f.emoji}</span>
              <span className="font-headline text-base text-on-surface">
                {f.label}
              </span>
            </button>
          ))}
        </div>
      </ScreenShell>
    );
  }

  if (view.kind === "feeling") {
    const f = view.feeling;
    return (
      <ScreenShell
        title={f.label}
        eyebrow="Your feeling"
        onBack={() => setView({ kind: "feelings" })}
        tone="secondary"
      >
        <div className="rounded-[2rem] border border-secondary/15 bg-secondary-container/20 p-8 text-center">
          <div className="text-8xl leading-none">{f.emoji}</div>
          <p className="mt-6 font-headline text-2xl leading-snug text-on-surface">
            {f.response}
          </p>
        </div>
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            Try this
          </p>
          <p className="mt-3 text-base leading-relaxed text-on-surface">
            {f.suggestion}
          </p>
        </div>
      </ScreenShell>
    );
  }

  if (view.kind === "draw") {
    return (
      <ScreenShell
        title="Draw Something"
        eyebrow="Tap and drag"
        onBack={back}
        tone="tertiary"
      >
        <KidCanvas />
      </ScreenShell>
    );
  }

  // coloring
  return (
    <ScreenShell
      title="Coloring Pages"
      eyebrow="Ask a grown-up to print"
      onBack={back}
      tone="primary"
    >
      <div className="rounded-2xl bg-primary-container/25 p-5">
        <p className="text-sm leading-relaxed text-on-surface">
          These are ideas staff can help print or draw by hand for you. No
          printer needed — they work with just paper and a pen.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {COLORING_IDEAS.map((c) => (
          <div
            key={c.title}
            className="flex items-start gap-4 rounded-2xl border border-outline-variant/20 bg-white/80 p-5"
          >
            <span className="text-4xl leading-none">{c.emoji}</span>
            <div>
              <h3 className="font-headline text-lg text-on-surface">{c.title}</h3>
              <p className="text-sm text-on-surface-variant">{c.description}</p>
            </div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

// ── Shells & helpers ─────────────────────────────────────────────

function ScreenShell({
  title,
  eyebrow,
  onBack,
  tone,
  children,
}: {
  title: string;
  eyebrow: string;
  onBack: () => void;
  tone: "primary" | "secondary" | "tertiary";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary-container text-primary"
      : tone === "secondary"
        ? "bg-secondary-container text-secondary"
        : "bg-tertiary-container text-tertiary";

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-6 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] ${toneClass}`}
            >
              {eyebrow}
            </span>
            <h1 className="mt-3 font-headline text-3xl text-on-surface">
              {title}
            </h1>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/25 bg-white text-on-surface-variant hover:bg-surface-container"
            aria-label="Back"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </div>
      </div>
      {children}
    </section>
  );
}

function KidCard({
  emoji,
  title,
  description,
  onClick,
  color,
}: {
  emoji: string;
  title: string;
  description: string;
  onClick: () => void;
  color: "primary" | "secondary" | "tertiary";
}) {
  const bg =
    color === "primary"
      ? "bg-primary-container/25 border-primary/15 hover:bg-primary-container/40"
      : color === "secondary"
        ? "bg-secondary-container/25 border-secondary/15 hover:bg-secondary-container/40"
        : "bg-tertiary-container/25 border-tertiary/15 hover:bg-tertiary-container/40";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col gap-3 rounded-2xl border p-6 text-left transition-all hover:-translate-y-0.5 ${bg}`}
    >
      <span className="text-5xl leading-none">{emoji}</span>
      <h3 className="font-headline text-xl text-on-surface">{title}</h3>
      <p className="text-sm text-on-surface-variant">{description}</p>
    </button>
  );
}

// ── Simple kid-friendly canvas ──────────────────────────────────

function KidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(KID_COLORS[4]);
  const [strokes, setStrokes] = useState<
    { points: { x: number; y: number }[]; color: string }[]
  >([]);
  const [current, setCurrent] = useState<
    { points: { x: number; y: number }[]; color: string } | null
  >(null);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    const drawOne = (s: { points: { x: number; y: number }[]; color: string }) => {
      if (s.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(s.points[0].x * rect.width, s.points[0].y * rect.height);
      s.points.slice(1).forEach((p) =>
        ctx.lineTo(p.x * rect.width, p.y * rect.height),
      );
      ctx.strokeStyle = s.color;
      ctx.lineWidth = KID_BRUSH;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    };
    strokes.forEach(drawOne);
    if (current) drawOne(current);
  }, [strokes, current]);

  useEffect(() => {
    redraw();
    window.addEventListener("resize", redraw);
    return () => window.removeEventListener("resize", redraw);
  }, [redraw]);

  const toPoint = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const r = c.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    };
  };

  const begin = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setCurrent({ points: [toPoint(e)], color });
  };
  const extend = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!current) return;
    setCurrent({ ...current, points: [...current.points, toPoint(e)] });
  };
  const end = () => {
    setCurrent((c) => {
      if (!c) return null;
      setStrokes((s) => [...s, c]);
      return null;
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-outline-variant/20 bg-white p-3">
        <div className="flex flex-wrap gap-2">
          {KID_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-10 w-10 rounded-full border-4 transition-all ${
                color === c
                  ? "border-on-surface scale-110"
                  : "border-white"
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Pick color ${c}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStrokes((s) => s.slice(0, -1))}
            disabled={!strokes.length}
            className="rounded-full bg-surface-container px-4 py-2 text-sm font-semibold text-on-surface disabled:opacity-40"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => {
              setStrokes([]);
              setCurrent(null);
            }}
            className="rounded-full bg-surface-container px-4 py-2 text-sm font-semibold text-on-surface"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border-2 border-outline-variant/20 bg-white">
        <canvas
          ref={canvasRef}
          className="aspect-[4/3] w-full touch-none"
          onPointerDown={begin}
          onPointerMove={extend}
          onPointerUp={end}
          onPointerLeave={end}
        />
      </div>
    </div>
  );
}
