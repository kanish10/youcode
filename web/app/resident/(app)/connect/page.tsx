"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { createClient } from "@/lib/supabase";

interface Whisper {
  id: string;
  content: string;
  created_at: string;
  reaction_count: number;
}

const FALLBACK_WHISPERS: Whisper[] = [
  { id: "1", content: "Today I made it through another day. That is enough.", created_at: new Date(Date.now() - 2 * 3600000).toISOString(), reaction_count: 12 },
  { id: "2", content: "I am grateful for the warm shower this morning. Small things matter.", created_at: new Date(Date.now() - 5 * 3600000).toISOString(), reaction_count: 28 },
  { id: "3", content: "Find stillness in the movement. We are all finding our way.", created_at: new Date(Date.now() - 8 * 3600000).toISOString(), reaction_count: 7 },
  { id: "4", content: "To whoever needs to hear this: you are not alone in this shelter. We see you.", created_at: new Date(Date.now() - 24 * 3600000).toISOString(), reaction_count: 15 },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const REACTION_ICONS = [
  { icon: "local_florist", label: "resonances", color: "text-primary" },
  { icon: "favorite", label: "hearts", color: "text-error" },
  { icon: "celebration", label: "joys", color: "text-tertiary" },
];

export default function ConnectPage() {
  const { t } = useLanguage();
  const [whispers, setWhispers] = useState<Whisper[]>(FALLBACK_WHISPERS);
  const [showInput, setShowInput] = useState(false);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reactions, setReactions] = useState<Record<string, number>>({});

  useEffect(() => {
    // Try to load from Supabase, fall back silently
    const load = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("gratitude_notes")
          .select("id, content, created_at, reaction_count")
          .order("created_at", { ascending: false })
          .limit(10);
        if (data && data.length > 0) setWhispers(data);
      } catch {
        // keep fallback
      }
    };
    load();
  }, []);

  async function handleSubmit() {
    if (!draft.trim()) return;
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("gratitude_notes")
        .insert({ content: draft.trim(), is_anonymous: true, reaction_count: 0 })
        .select("id, content, created_at, reaction_count")
        .single();
      if (data) setWhispers((prev) => [data, ...prev]);
    } catch {
      // add locally
      setWhispers((prev) => [{
        id: Date.now().toString(),
        content: draft.trim(),
        created_at: new Date().toISOString(),
        reaction_count: 0,
      }, ...prev]);
    }
    setDraft("");
    setShowInput(false);
    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => setSubmitted(false), 3000);
  }

  function react(id: string) {
    setReactions((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  const cardStyles = [
    "bg-surface-container-highest/40 border-primary-container hover:border-primary",
    "bg-secondary-container/20 border-secondary-fixed hover:border-secondary",
    "bg-tertiary-container/10 border-tertiary-fixed hover:border-tertiary",
    "bg-surface-container border-outline-variant/20 hover:border-primary-dim",
  ];

  const reactionStyle = ["text-primary", "text-error", "text-tertiary"];

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-semibold mb-3 tracking-wider uppercase">
          {t("connect.badge")}
        </span>
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-1">{t("connect.title")}</h1>
        <p className="text-on-surface-variant text-sm">{t("connect.subtitle")}</p>
      </div>

      {/* Write whisper */}
      <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30 shadow-sm mb-8">
        {submitted ? (
          <div className="flex items-center gap-2 text-primary py-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span className="font-semibold text-sm">Your whisper was shared quietly.</span>
          </div>
        ) : showInput ? (
          <div className="space-y-3">
            <p className="text-sm text-on-surface-variant italic">{t("connect.prompt")}</p>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("connect.whisperPlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-white text-sm resize-none focus:ring-2 focus:ring-primary/20 outline-none"
              rows={3}
              maxLength={280}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={!draft.trim() || submitting}
                className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl font-semibold text-sm disabled:opacity-40"
              >
                {submitting ? t("common.loading") : t("connect.submit")}
              </button>
              <button
                onClick={() => { setShowInput(false); setDraft(""); }}
                className="px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant text-sm"
              >
                {t("common.close")}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm font-label text-on-surface-variant italic">{t("connect.prompt")}</p>
            <button
              onClick={() => setShowInput(true)}
              className="text-primary font-semibold text-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-lg">edit_note</span>
              {t("connect.leaveWhisper")}
            </button>
          </div>
        )}
      </div>

      {/* Whispers feed */}
      <div className="space-y-4">
        {whispers.map((w, i) => {
          const rIcon = REACTION_ICONS[i % 3];
          const totalReactions = w.reaction_count + (reactions[w.id] ?? 0);
          return (
            <article key={w.id} className={`p-5 rounded-xl border transition-all ${cardStyles[i % 4]}`}>
              <p className="font-headline text-base leading-relaxed text-on-surface mb-4 italic">
                &ldquo;{w.content}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => react(w.id)}
                  className={`flex items-center gap-1.5 ${reactionStyle[i % 3]} group`}
                >
                  <span
                    className="material-symbols-outlined text-xl transition-transform group-active:scale-125"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {rIcon.icon}
                  </span>
                  <span className="text-xs font-label">
                    {totalReactions} {t(`connect.${rIcon.label}` as Parameters<typeof t>[0])}
                  </span>
                </button>
                <span className="text-[10px] uppercase tracking-widest text-outline">{timeAgo(w.created_at)}</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
