"use client";

import { useEffect, useState } from "react";
import { createClient, Flower, ActivityLog } from "@/lib/supabase";
import GardenView from "@/components/garden-view";
import { StatCard, StatCardRow } from "@/components/stats-cards";

export default function DashboardHome() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [todaySessions, setTodaySessions] = useState(0);
  const [todayActivities, setTodayActivities] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const supabase = createClient();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    async function load() {
      const [flowerRes, sessionRes, activityRes, recentRes] = await Promise.all([
        supabase.from("flowers").select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("sessions").select("id").gte("started_at", todayStart.toISOString()),
        supabase.from("activity_logs").select("user_id").eq("completed", true).gte("created_at", todayStart.toISOString()),
        supabase.from("activity_logs").select("*, profiles(display_name, unique_code)").eq("completed", true).order("created_at", { ascending: false }).limit(10),
      ]);

      setFlowers(flowerRes.data ?? []);
      setTodaySessions(sessionRes.data?.length ?? 0);
      const activities = activityRes.data ?? [];
      setTodayActivities(activities.length);
      setUniqueUsers(new Set(activities.map((a: any) => a.user_id)).size);
      setRecentLogs((recentRes.data as ActivityLog[]) ?? []);
    }

    load();

    const channel = supabase
      .channel("realtime-dashboard")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "flowers" }, (payload) => {
        setFlowers((prev) => [payload.new as Flower, ...prev]);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_logs" }, (payload) => {
        const log = payload.new as ActivityLog;
        if (log.completed) {
          setTodayActivities((prev) => prev + 1);
          setRecentLogs((prev) => [log, ...prev].slice(0, 10));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="p-12 max-w-6xl mx-auto space-y-12">
      <header className="text-center">
        <h2 className="font-headline text-5xl text-primary-on-container mb-4">Living Garden</h2>
        <p className="text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          A real-time view of collective wellness. Each bloom represents a completed activity by a resident.
        </p>
      </header>

      <GardenView flowers={flowers} />

      <StatCardRow>
        <StatCard label="Blooms today" value={flowers.filter(f => isToday(f.created_at)).length} icon="local_florist" tint="primary" />
        <StatCard label="Sessions today" value={todaySessions} icon="calendar_today" tint="secondary" />
        <StatCard label="Activities completed" value={todayActivities} icon="check_circle" tint="tertiary" />
        <StatCard label="Active residents" value={uniqueUsers} icon="group" tint="primary" />
      </StatCardRow>

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
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${quadrantStyle(log.quadrant)}`}>
                      {log.quadrant}
                    </span>
                  </td>
                  <td className="px-6 py-4">{log.activity_type}</td>
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

function quadrantStyle(q: string) {
  switch (q) {
    case "mind": return "bg-primary-container/40 text-primary";
    case "body": return "bg-secondary-container/50 text-secondary";
    case "soul": return "bg-tertiary-container/40 text-tertiary";
    default: return "bg-surface-variant text-on-surface-variant";
  }
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
