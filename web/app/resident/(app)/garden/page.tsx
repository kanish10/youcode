"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { createClient } from "@/lib/supabase";

interface Bloom {
  id: string;
  activity_type: string;
  activity_name: string;
  created_at: string;
}

const BLOOM_ICONS: Record<string, string> = {
  body: "local_florist",
  breathing: "air",
  grounding: "anchor",
  soul: "auto_awesome",
  connect: "spa",
  default: "local_florist",
};

const BLOOM_COLORS = [
  "text-primary bg-primary-container/40",
  "text-secondary bg-secondary-container/40",
  "text-tertiary bg-tertiary-container/40",
  "text-primary bg-primary-container/60",
  "text-secondary bg-secondary-container/60",
];

const DEMO_BLOOMS: Bloom[] = [
  { id: "1", activity_type: "body", activity_name: "Chair Yoga", created_at: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: "2", activity_type: "breathing", activity_name: "Box Breathing", created_at: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: "3", activity_type: "body", activity_name: "Morning Yoga Flow", created_at: new Date(Date.now() - 6 * 3600000).toISOString() },
  { id: "4", activity_type: "soul", activity_name: "Soul Expression", created_at: new Date(Date.now() - 26 * 3600000).toISOString() },
  { id: "5", activity_type: "grounding", activity_name: "5-4-3-2-1 Grounding", created_at: new Date(Date.now() - 28 * 3600000).toISOString() },
  { id: "6", activity_type: "body", activity_name: "Neck & Shoulder Release", created_at: new Date(Date.now() - 50 * 3600000).toISOString() },
  { id: "7", activity_type: "connect", activity_name: "Community Whisper", created_at: new Date(Date.now() - 72 * 3600000).toISOString() },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

export default function GardenPage() {
  const { t, bloomId } = useLanguage();
  const [blooms, setBlooms] = useState<Bloom[]>(DEMO_BLOOMS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bloomId) return;
    setLoading(true);
    const load = async () => {
      try {
        const supabase = createClient();
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("bloom_id", bloomId)
          .single();
        if (profile) {
          const { data } = await supabase
            .from("activity_logs")
            .select("id, activity_type, activity_name, created_at")
            .eq("resident_id", profile.id)
            .order("created_at", { ascending: false })
            .limit(50);
          if (data && data.length > 0) setBlooms(data);
        }
      } catch {
        // keep demo data
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bloomId]);

  const today = blooms.filter((b) => new Date(b.created_at).toDateString() === new Date().toDateString());
  const total = blooms.length;

  // Group by date
  const grouped: Record<string, Bloom[]> = {};
  blooms.forEach((b) => {
    const key = formatDate(b.created_at);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(b);
  });

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      {/* Header */}
      <section className="mb-6">
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-1">{t("garden.title")}</h1>
        <p className="text-on-surface-variant text-sm">{t("garden.subtitle")}</p>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-primary-container/20 rounded-2xl p-5 text-center border border-primary/10">
          <div className="font-headline text-4xl font-bold text-primary mb-1">{total}</div>
          <div className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{t("garden.totalBlooms")}</div>
        </div>
        <div className="bg-secondary-container/20 rounded-2xl p-5 text-center border border-secondary/10">
          <div className="font-headline text-4xl font-bold text-secondary mb-1">{today.length}</div>
          <div className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{t("garden.todayBlooms")}</div>
        </div>
      </div>

      {/* Visual bloom garden */}
      {total > 0 && (
        <div className="bg-surface-container rounded-2xl p-5 mb-8 border border-outline-variant/20">
          <div className="flex flex-wrap gap-3 justify-center">
            {blooms.slice(0, 24).map((b, i) => {
              const icon = BLOOM_ICONS[b.activity_type] ?? BLOOM_ICONS.default;
              const colorClass = BLOOM_COLORS[i % BLOOM_COLORS.length];
              return (
                <div
                  key={b.id}
                  title={b.activity_name}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </div>
              );
            })}
            {total > 24 && (
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-high text-on-surface-variant text-xs font-bold">
                +{total - 24}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      {loading ? (
        <div className="text-center text-on-surface-variant text-sm py-8">{t("common.loading")}</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-3">{date}</h3>
              <div className="space-y-2">
                {items.map((b, i) => {
                  const icon = BLOOM_ICONS[b.activity_type] ?? BLOOM_ICONS.default;
                  const colorClass = BLOOM_COLORS[i % BLOOM_COLORS.length];
                  return (
                    <div key={b.id} className="flex items-center gap-3 bg-surface-container-low rounded-xl p-3 border border-outline-variant/10">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">{b.activity_name}</p>
                        <p className="text-xs text-on-surface-variant">{b.activity_type}</p>
                      </div>
                      <span className="text-[10px] text-outline whitespace-nowrap">
                        {new Date(b.created_at).toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && total === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-4xl text-outline-variant mb-3 block">local_florist</span>
          <p className="text-on-surface-variant text-sm">Your garden is waiting to bloom.<br />Complete an activity to plant your first flower.</p>
        </div>
      )}
    </div>
  );
}
