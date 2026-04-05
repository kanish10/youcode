"use client";

import { useState } from "react";
import {
  COUNTRIES,
  RELIGIONS,
  type Country,
  type Religion,
  type Song,
} from "@/lib/threads-content";

type View =
  | { kind: "entry" }
  | { kind: "countryList" }
  | { kind: "countryDetail"; country: Country }
  | { kind: "religionList" }
  | { kind: "religionDetail"; religion: Religion };

export default function ThreadsOfHome() {
  const [view, setView] = useState<View>({ kind: "entry" });

  // ── ENTRY: Country or Religion ────────────────────────────────
  if (view.kind === "entry") {
    return (
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
          <span className="inline-flex rounded-full bg-tertiary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-tertiary">
            Threads of home
          </span>
          <h1 className="mt-4 font-headline text-4xl text-on-surface">
            The parts of you that travel.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">
            A quiet corner for songs, scriptures, proverbs, and the cultural or
            spiritual threads that make you feel like yourself. Pick the way in
            that feels right today.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <button
            type="button"
            onClick={() => setView({ kind: "countryList" })}
            className="group rounded-[1.75rem] border border-outline-variant/20 bg-white/80 p-8 text-left transition-all hover:-translate-y-0.5 hover:bg-primary-container/20 hover:border-primary/30"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container text-primary">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                public
              </span>
            </div>
            <h2 className="mt-5 font-headline text-3xl leading-snug text-on-surface">
              Choose by country
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
              Reconnect through the history, proverbs, and beloved old songs of
              where you come from.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary">
              Browse {COUNTRIES.length} countries
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setView({ kind: "religionList" })}
            className="group rounded-[1.75rem] border border-outline-variant/20 bg-white/80 p-8 text-left transition-all hover:-translate-y-0.5 hover:bg-tertiary-container/20 hover:border-tertiary/30"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-tertiary-container text-tertiary">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                self_improvement
              </span>
            </div>
            <h2 className="mt-5 font-headline text-3xl leading-snug text-on-surface">
              Choose by faith
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
              Sacred texts, devotional songs, and simple prayers — from the
              tradition that holds you, or one you want to sit with today.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-tertiary">
              Browse {RELIGIONS.length} traditions
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </div>
          </button>
        </div>
      </section>
    );
  }

  // ── COUNTRY LIST ───────────────────────────────────────────────
  if (view.kind === "countryList") {
    return (
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-primary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Threads · by country
              </span>
              <h1 className="mt-4 font-headline text-4xl text-on-surface">
                Where do you come from?
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">
                Tap your homeland — or a place that holds part of your story.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setView({ kind: "entry" })}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/25 bg-white text-on-surface-variant hover:bg-surface-container"
              aria-label="Back"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {COUNTRIES.map((country) => (
            <button
              key={country.id}
              type="button"
              onClick={() => setView({ kind: "countryDetail", country })}
              className="group flex items-center gap-4 rounded-2xl border border-outline-variant/20 bg-white/80 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-container/15"
            >
              <span className="text-4xl leading-none">{country.flag}</span>
              <div className="min-w-0 flex-1">
                <p className="font-headline text-lg text-on-surface truncate">
                  {country.name}
                </p>
                <p className="text-xs text-on-surface-variant truncate">
                  {country.nativeName}
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant transition-transform group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  // ── COUNTRY DETAIL ────────────────────────────────────────────
  if (view.kind === "countryDetail") {
    const c = view.country;
    return (
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-5">
              <span className="text-6xl leading-none">{c.flag}</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                  {c.nativeName}
                </p>
                <h1 className="mt-1 font-headline text-4xl text-on-surface">
                  {c.name}
                </h1>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setView({ kind: "countryList" })}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/25 bg-white text-on-surface-variant hover:bg-surface-container"
              aria-label="Back to countries"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-on-surface-variant">
            {c.intro}
          </p>
        </div>

        {/* Proverb */}
        <div className="rounded-[1.75rem] border border-primary/15 bg-primary-container/25 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            A saying from home
          </p>
          <p className="mt-4 font-headline text-2xl leading-snug text-on-surface">
            &ldquo;{c.proverb}&rdquo;
          </p>
          <p className="mt-3 text-sm italic text-on-surface-variant">
            {c.proverbSource}
          </p>
        </div>

        {/* History */}
        <div className="rounded-[1.75rem] border border-outline-variant/20 bg-surface-container p-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">
              history_edu
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              A note from the land
            </p>
          </div>
          <p className="mt-4 text-base leading-relaxed text-on-surface">
            {c.historyNote}
          </p>
        </div>

        {/* Songs */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">
              music_note
            </span>
            <h2 className="font-headline text-2xl text-on-surface">
              Old famous songs
            </h2>
          </div>
          {c.songs.map((song) => (
            <SongCard key={song.title} song={song} tone="primary" />
          ))}
        </div>
      </section>
    );
  }

  // ── RELIGION LIST ──────────────────────────────────────────────
  if (view.kind === "religionList") {
    return (
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-tertiary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-tertiary">
                Threads · by faith
              </span>
              <h1 className="mt-4 font-headline text-4xl text-on-surface">
                Which tradition holds you?
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">
                Choose the one you practice — or one you want to learn from
                today. There&rsquo;s no wrong answer.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setView({ kind: "entry" })}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/25 bg-white text-on-surface-variant hover:bg-surface-container"
              aria-label="Back"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RELIGIONS.map((r) => {
            const tone = toneClasses(r.colorTone);
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setView({ kind: "religionDetail", religion: r })}
                className={`group rounded-2xl border p-6 text-left transition-all hover:-translate-y-0.5 ${tone.card}`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone.icon}`}
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {r.icon}
                  </span>
                </div>
                <h2 className="mt-5 font-headline text-2xl leading-snug text-on-surface">
                  {r.name}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant line-clamp-3">
                  {r.intro}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  // ── RELIGION DETAIL ────────────────────────────────────────────
  const r = view.religion;
  const tone = toneClasses(r.colorTone);
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${tone.icon}`}
            >
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {r.icon}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                Tradition
              </p>
              <h1 className="mt-1 font-headline text-4xl text-on-surface">
                {r.name}
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setView({ kind: "religionList" })}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/25 bg-white text-on-surface-variant hover:bg-surface-container"
            aria-label="Back to religions"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </div>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-on-surface-variant">
          {r.intro}
        </p>
      </div>

      {/* Sacred text */}
      <div className={`rounded-[1.75rem] border p-6 ${tone.card}`}>
        <p
          className={`text-xs font-bold uppercase tracking-[0.22em] ${tone.label}`}
        >
          {r.sacredText.title}
        </p>
        <p className="mt-4 font-headline text-2xl leading-snug text-on-surface">
          &ldquo;{r.sacredText.excerpt}&rdquo;
        </p>
        <p className="mt-3 text-sm italic text-on-surface-variant">
          — {r.sacredText.source}
        </p>
      </div>

      {/* Prayer / meditation */}
      <div className="rounded-[1.75rem] border border-outline-variant/20 bg-surface-container p-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant">
            format_quote
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            {r.prayer.title}
          </p>
        </div>
        <p className="mt-4 text-base leading-relaxed text-on-surface">
          {r.prayer.text}
        </p>
      </div>

      {/* Songs */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className={`material-symbols-outlined ${tone.label}`}>
            library_music
          </span>
          <h2 className="font-headline text-2xl text-on-surface">
            Devotional music
          </h2>
        </div>
        {r.songs.map((song) => (
          <SongCard key={song.title} song={song} tone={r.colorTone} />
        ))}
      </div>
    </section>
  );
}

// ── Helpers ────────────────────────────────────────────────────

function toneClasses(tone: "primary" | "secondary" | "tertiary") {
  if (tone === "primary") {
    return {
      card: "border-primary/15 bg-primary-container/20",
      icon: "bg-primary text-white",
      label: "text-primary",
    };
  }
  if (tone === "secondary") {
    return {
      card: "border-secondary/15 bg-secondary-container/20",
      icon: "bg-secondary text-white",
      label: "text-secondary",
    };
  }
  return {
    card: "border-tertiary/15 bg-tertiary-container/20",
    icon: "bg-tertiary text-white",
    label: "text-tertiary",
  };
}

function SongCard({
  song,
  tone,
}: {
  song: Song;
  tone: "primary" | "secondary" | "tertiary";
}) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(song.youtubeQuery)}`;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(song.youtubeQuery)}`;
  const t = toneClasses(tone);

  return (
    <div className={`overflow-hidden rounded-[1.5rem] border ${t.card}`}>
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex-1 min-w-0">
          <h3 className="font-headline text-xl text-on-surface">{song.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
            {song.description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${t.icon}`}
          aria-label={playing ? "Hide player" : "Play"}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {playing ? "close" : "play_arrow"}
          </span>
        </button>
      </div>
      {playing && (
        <div className="bg-black">
          <div className="relative w-full pb-[56.25%]">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={embedUrl}
              title={song.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="bg-surface-container-low p-3 text-center">
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              Open on YouTube if video doesn&rsquo;t load
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
