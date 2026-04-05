"use client";

import { useEffect, useState } from "react";
import { createClient, Flower, ActivityLog } from "@/lib/supabase";
import GardenView from "@/components/garden-view";

type AnonEvent = {
  id: string;
  quadrant: string;
  activity_type: string;
  duration_seconds: number;
  created_at: string;
};

export default function DashboardHome() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [anonEvents, setAnonEvents] = useState<AnonEvent[]>([]);
  const [todaySessions, setTodaySessions] = useState(0);
  const [todayActivities, setTodayActivities] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);
  const [langDist, setLangDist] = useState<Record<string, number>>({});

  useEffect(() => {
    const supabase = createClient();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    async function load() {
      const [flowerRes, sessionRes, activityRes, recentRes, anonRes, langRes] = await Promise.all([
        supabase.from("flowers").select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("sessions").select("id").gte("started_at", todayStart.toISOString()),
        supabase.from("activity_logs").select("user_id").eq("completed", true).gte("created_at", todayStart.toISOString()),
        supabase.from("activity_logs").select("*, profiles(display_name, unique_code)").eq("completed", true).order("created_at", { ascending: false }).limit(10),
        supabase.from("kiosk_anonymous_events").select("*").order("created_at", { ascending: false }).limit(500),
        supabase.from("sessions").select("language").limit(200),
      ]);

      setFlowers(flowerRes.data ?? []);
      setAnonEvents((anonRes.data as AnonEvent[]) ?? []);
      setTodaySessions(sessionRes.data?.length ?? 0);
      const activities = activityRes.data ?? [];
      setTodayActivities(activities.length);
      setUniqueUsers(new Set(activities.map((a: any) => a.user_id)).size);
      setRecentLogs((recentRes.data as ActivityLog[]) ?? []);

      const ld: Record<string, number> = {};
      (langRes.data ?? []).forEach((s: any) => {
        const l = s.language || "en";
        ld[l] = (ld[l] || 0) + 1;
      });
      setLangDist(ld);
    }

    load();

    const channel = supabase
      .channel("realtime-dashboard")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "flowers" }, (payload) => {
        setFlowers((prev) => [payload.new as Flower, ...prev]);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "kiosk_anonymous_events" }, (payload) => {
        const evt = payload.new as AnonEvent;
        setAnonEvents((prev) => [evt, ...prev]);
        setTodayActivities((prev) => prev + 1);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_logs" }, (payload) => {
        const log = payload.new as ActivityLog;
        if (log.completed) {
          setRecentLogs((prev) => [log, ...prev].slice(0, 10));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Combine flowers + anonymous events for total bloom count
  const totalBlooms = flowers.length + anonEvents.length;
  const todayBlooms = flowers.filter((f) => isToday(f.created_at)).length +
    anonEvents.filter((e) => isToday(e.created_at)).length;

  // Also count today's anon activities for the Activities stat
  const todayAnonActivities = anonEvents.filter((e) => isToday(e.created_at)).length;
  const combinedTodayActivities = todayActivities + todayAnonActivities;

  // Quadrant distribution — from anonymous events (primary universal log)
  const quadrantCounts = { mind: 0, body: 0, soul: 0, connect: 0 };
  anonEvents.forEach((e) => {
    if (e.quadrant in quadrantCounts) quadrantCounts[e.quadrant as keyof typeof quadrantCounts]++;
  });
  const totalQActivities = Object.values(quadrantCounts).reduce((a, b) => a + b, 0);
  const topPillar = Object.entries(quadrantCounts).sort((a, b) => b[1] - a[1])[0];

  // Peak usage hours
  const hourCounts: Record<number, number> = {};
  anonEvents.forEach((e) => {
    const h = new Date(e.created_at).getHours();
    hourCounts[h] = (hourCounts[h] || 0) + 1;
  });
  const peakHours = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([h, c]) => ({ hour: parseInt(h), count: c }));
  const maxHourCount = peakHours[0]?.count || 1;

  // Language distribution
  const totalLang = Object.values(langDist).reduce((a, b) => a + b, 0) || 1;
  const langEntries = Object.entries(langDist).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const LANG_NAMES: Record<string, string> = {
    en: "English", fr: "Français", es: "Español", ar: "العربية", pa: "ਪੰਜਾਬੀ",
    zh: "中文", tl: "Tagalog", fa: "فارسی", hi: "हिन्दी", vi: "Tiếng Việt",
    ko: "한국어", ja: "日本語", yue: "粵語",
  };

  // Top activities — from anonymous events
  const actCounts: Record<string, number> = {};
  anonEvents.forEach((e) => { actCounts[e.activity_type] = (actCounts[e.activity_type] || 0) + 1; });
  const topActivities = Object.entries(actCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="text-center mb-2">
        <h2 className="font-headline text-5xl text-on-primary-container mb-4">Living Garden</h2>
        <p className="text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          A visual representation of our collective journey. Each bloom signifies a shared activity completed by our community today.
        </p>
      </header>

      {/* Garden View */}
      <GardenView totalBlooms={totalBlooms} quadrantCounts={quadrantCounts} />

      {/* Bento Analytics Grid */}
      <div className="grid grid-cols-12 gap-6">

        {/* Total Blooms - Hero stat */}
        <div className="col-span-12 md:col-span-4 bg-primary-container/30 rounded-2xl p-6 border border-primary-fixed-dim/30">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_florist</span>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Total Blooms Grown</span>
          </div>
          <p className="text-5xl font-bold text-on-surface">{totalBlooms.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">+{todayBlooms} today</span>
          </div>
          {/* Mini bar chart */}
          <div className="flex items-end gap-1 mt-4 h-10">
            {[0.3, 0.5, 0.4, 0.7, 0.6, 0.9, 1.0].map((v, i) => (
              <div
                key={i}
                className="flex-1 bg-primary/30 rounded-sm transition-all"
                style={{ height: `${v * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Most Used Pillar */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Most Used Pillar</p>
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${pillarStyle(topPillar?.[0]).bg}`}>
              <span className="material-symbols-outlined text-3xl" style={{ color: pillarStyle(topPillar?.[0]).color, fontVariationSettings: "'FILL' 1" }}>
                {pillarStyle(topPillar?.[0]).icon}
              </span>
            </div>
            <div>
              <p className="font-headline text-2xl font-bold text-on-surface capitalize">{topPillar?.[0] ?? "—"}</p>
              <p className="text-sm text-on-surface-variant">
                {totalQActivities > 0 ? `${Math.round((topPillar?.[1] ?? 0) / totalQActivities * 100)}% of interactions` : "No data yet"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-span-12 md:col-span-4 grid grid-cols-2 gap-4">
          <div className="bg-secondary-container/30 rounded-2xl p-5 border border-secondary-fixed-dim/30">
            <span className="material-symbols-outlined text-secondary mb-2 block">calendar_today</span>
            <p className="text-2xl font-bold text-on-surface">{todaySessions}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium mt-1">Sessions Today</p>
          </div>
          <div className="bg-tertiary-container/30 rounded-2xl p-5 border border-tertiary-fixed-dim/30">
            <span className="material-symbols-outlined text-tertiary mb-2 block">check_circle</span>
            <p className="text-2xl font-bold text-on-surface">{combinedTodayActivities}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium mt-1">Activities</p>
          </div>
          <div className="bg-primary-container/20 rounded-2xl p-5 border border-primary-fixed-dim/30">
            <span className="material-symbols-outlined text-primary mb-2 block">group</span>
            <p className="text-2xl font-bold text-on-surface">{uniqueUsers}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium mt-1">Active Users</p>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant mb-2 block">translate</span>
            <p className="text-2xl font-bold text-on-surface">{Object.keys(langDist).length || 1}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium mt-1">Languages</p>
          </div>
        </div>

        {/* Peak Usage Times */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Peak Usage Times</p>
          <div className="space-y-3">
            {peakHours.length === 0 && <p className="text-sm text-on-surface-variant">No data yet</p>}
            {peakHours.map(({ hour, count }) => (
              <div key={hour} className="flex items-center gap-3">
                <span className="text-sm font-medium text-on-surface w-12">{formatHour(hour)}</span>
                <div className="flex-1 h-6 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/40 rounded-full transition-all"
                    style={{ width: `${(count / maxHourCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-on-surface-variant w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Language Distribution — Pie Chart */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Language Distribution</p>
          {langEntries.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No data yet</p>
          ) : (
            <div className="flex flex-col items-center gap-5">
              {/* Donut chart */}
              <div className="relative" style={{ width: 140, height: 140 }}>
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: (() => {
                      const PIE_COLORS = ["#52695e", "#6d6258", "#6b6077", "#b8a88a", "#8FA89B"];
                      let cur = 0;
                      const parts = langEntries.map(([, c], i) => {
                        const pct = (c / totalLang) * 100;
                        const seg = `${PIE_COLORS[i % PIE_COLORS.length]} ${cur}% ${cur + pct}%`;
                        cur += pct;
                        return seg;
                      });
                      if (cur < 100) parts.push(`#d4d2cc ${cur}% 100%`);
                      return `conic-gradient(${parts.join(", ")})`;
                    })(),
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[84px] h-[84px] rounded-full bg-surface-container-low flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xl font-bold text-on-surface">{Object.keys(langDist).length}</p>
                      <p className="text-[9px] text-on-surface-variant uppercase tracking-wider">Languages</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="w-full space-y-2">
                {langEntries.map(([code, count], i) => {
                  const PIE_COLORS = ["#52695e", "#6d6258", "#6b6077", "#b8a88a", "#8FA89B"];
                  const pct = Math.round((count / totalLang) * 100);
                  return (
                    <div key={code} className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="text-sm text-on-surface flex-1 truncate">{LANG_NAMES[code] ?? code}</span>
                      <span className="text-xs text-on-surface-variant font-medium">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Top Activities */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Top Activities This Week</p>
          <div className="space-y-3">
            {topActivities.length === 0 && <p className="text-sm text-on-surface-variant">No data yet</p>}
            {topActivities.map(([name, count], i) => (
              <div key={name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-on-surface-variant w-5">{i + 1}.</span>
                <span className="text-sm text-on-surface flex-1 truncate capitalize">{name.replace(/-/g, " ")}</span>
                <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wellness Focus Breakdown */}
        <div className="col-span-12 md:col-span-6 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Wellness Focus</p>
          <div className="grid grid-cols-2 gap-4">
            {(["mind", "body", "soul", "connect"] as const).map((q) => {
              const ps = pillarStyle(q);
              const count = quadrantCounts[q];
              const pct = totalQActivities > 0 ? Math.round((count / totalQActivities) * 100) : 0;
              return (
                <div key={q} className={`${ps.bg} rounded-xl p-4 flex items-center gap-3`}>
                  <span className="material-symbols-outlined text-2xl" style={{ color: ps.color, fontVariationSettings: "'FILL' 1" }}>{ps.icon}</span>
                  <div>
                    <p className="font-bold text-lg text-on-surface capitalize">{q}</p>
                    <p className="text-xs text-on-surface-variant">{pct}% · {count} activities</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights & Suggestions */}
        <div className="col-span-12 md:col-span-6 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Insights & Suggestions</p>
          <div className="space-y-4">
            <div className="bg-primary-container/20 rounded-xl p-4 flex gap-3">
              <span className="material-symbols-outlined text-primary shrink-0 mt-0.5">lightbulb</span>
              <div>
                <p className="text-sm font-semibold text-on-surface">Body Pillar Activity</p>
                <p className="text-xs text-on-surface-variant mt-1">
                  {quadrantCounts.body < quadrantCounts.mind
                    ? "Body activities are underutilized compared to Mind. Consider promoting gentle movement exercises."
                    : "Body activities are popular. Keep the exercise catalog fresh with new additions."}
                </p>
              </div>
            </div>
            <div className="bg-tertiary-container/20 rounded-xl p-4 flex gap-3">
              <span className="material-symbols-outlined text-tertiary shrink-0 mt-0.5">schedule</span>
              <div>
                <p className="text-sm font-semibold text-on-surface">Engagement Timing</p>
                <p className="text-xs text-on-surface-variant mt-1">
                  {peakHours.length > 0
                    ? `Peak usage is at ${formatHour(peakHours[0].hour)}. Consider scheduling group activities around this time.`
                    : "Not enough data yet to identify peak usage patterns."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <section>
        <h3 className="font-headline text-2xl text-on-surface mb-6">Recent Activity</h3>
        <div className="bg-white rounded-xl border border-outline-variant/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-high text-on-surface-variant text-xs uppercase tracking-widest">
              <tr>
                <th className="text-left px-6 py-3">Resident</th>
                <th className="text-left px-6 py-3">Quadrant</th>
                <th className="text-left px-6 py-3">Activity</th>
                <th className="text-left px-6 py-3">Duration</th>
                <th className="text-left px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {recentLogs.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-on-surface-variant">No activity yet. Data appears in real-time as residents use the app.</td></tr>
              )}
              {recentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-variant/20 transition-colors">
                  <td className="px-6 py-4 font-medium">{(log.profiles as any)?.unique_code ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${quadrantBadge(log.quadrant)}`}>
                      {log.quadrant}
                    </span>
                  </td>
                  <td className="px-6 py-4 capitalize">{log.activity_type.replace(/-/g, " ")}</td>
                  <td className="px-6 py-4">{log.duration_seconds ? `${Math.round(log.duration_seconds / 60)}m` : "—"}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{timeAgo(log.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function pillarStyle(q?: string) {
  switch (q) {
    case "mind": return { bg: "bg-primary-container/30", color: "#52695e", icon: "psychology" };
    case "body": return { bg: "bg-secondary-container/30", color: "#6d6258", icon: "fitness_center" };
    case "soul": return { bg: "bg-tertiary-container/30", color: "#6b6077", icon: "auto_awesome" };
    case "connect": return { bg: "bg-surface-variant/40", color: "#6d6258", icon: "diversity_3" };
    default: return { bg: "bg-surface-variant/30", color: "#6d6258", icon: "spa" };
  }
}

function quadrantBadge(q: string) {
  switch (q) {
    case "mind": return "bg-primary-container/40 text-primary";
    case "body": return "bg-secondary-container/50 text-secondary";
    case "soul": return "bg-tertiary-container/40 text-tertiary";
    default: return "bg-surface-variant text-on-surface-variant";
  }
}

function formatHour(h: number) {
  if (h === 0) return "12AM";
  if (h === 12) return "12PM";
  return h > 12 ? `${h - 12}PM` : `${h}AM`;
}

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
