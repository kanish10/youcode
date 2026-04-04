"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, ActivityLog } from "@/lib/supabase";

type AnonEvent = {
  id: string;
  quadrant: string;
  activity_type: string;
  duration_seconds: number;
  created_at: string;
};

type UnifiedRow = {
  id: string;
  source: "profile" | "anon";
  residentLabel: string;
  quadrant: string;
  activity_type: string;
  duration_seconds: number;
  created_at: string;
};

export default function ActivityLogsPage() {
  const [rows, setRows] = useState<UnifiedRow[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [filter]);

  async function load() {
    setLoading(true);
    const supabase = createClient();

    let q = supabase
      .from("activity_logs")
      .select("*, profiles(display_name, unique_code)")
      .eq("completed", true)
      .order("created_at", { ascending: false })
      .limit(150);

    if (filter !== "all") q = q.eq("quadrant", filter);

    const [{ data: logs }, { data: anon }] = await Promise.all([
      q,
      supabase.from("kiosk_anonymous_events").select("*").order("created_at", { ascending: false }).limit(150),
    ]);

    const profileRows: UnifiedRow[] = ((logs as ActivityLog[]) ?? []).map((log) => ({
      id: log.id,
      source: "profile" as const,
      residentLabel: (log.profiles as { unique_code?: string })?.unique_code ?? "—",
      quadrant: log.quadrant,
      activity_type: log.activity_type,
      duration_seconds: log.duration_seconds,
      created_at: log.created_at,
    }));

    let anonRows: UnifiedRow[] = ((anon as AnonEvent[]) ?? []).map((e) => ({
      id: e.id,
      source: "anon" as const,
      residentLabel: "Guest / tablet",
      quadrant: e.quadrant,
      activity_type: e.activity_type,
      duration_seconds: e.duration_seconds,
      created_at: e.created_at,
    }));

    if (filter !== "all") {
      anonRows = anonRows.filter((r) => r.quadrant === filter);
    }

    const merged = [...profileRows, ...anonRows].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    setRows(merged.slice(0, 200));
    setLoading(false);
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const s = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.residentLabel.toLowerCase().includes(s) ||
        r.activity_type.toLowerCase().includes(s)
    );
  }, [rows, search]);

  return (
    <div className="p-12 max-w-6xl mx-auto space-y-8">
      <header>
        <span className="text-primary font-bold tracking-widest text-xs uppercase">Monitoring</span>
        <h2 className="font-headline text-4xl text-on-surface mt-2">Activity Logs</h2>
        <p className="text-on-surface-variant mt-2">
          Resident-linked activities and anonymous tablet completions (guest or unknown ID).
        </p>
      </header>

      <div className="flex flex-wrap gap-4 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or activity…"
          className="px-4 py-2 rounded-full border border-outline-variant/20 bg-white text-sm w-72 focus:ring-2 focus:ring-primary/20 outline-none"
        />
        {["all", "mind", "body", "soul", "connect"].map((q) => (
          <button
            key={q}
            onClick={() => setFilter(q)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
              filter === q ? "bg-primary text-white" : "bg-surface-variant text-on-surface-variant hover:bg-surface-high"
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-outline-variant/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-high text-on-surface-variant text-xs uppercase tracking-widest">
            <tr>
              <th className="text-left px-6 py-3">Resident</th>
              <th className="text-left px-6 py-3">Source</th>
              <th className="text-left px-6 py-3">Quadrant</th>
              <th className="text-left px-6 py-3">Activity</th>
              <th className="text-left px-6 py-3">Duration</th>
              <th className="text-left px-6 py-3">Completed at</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {loading && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-on-surface-variant">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-on-surface-variant">
                  No activity logs found.
                </td>
              </tr>
            )}
            {filtered.map((log) => (
              <tr key={`${log.source}-${log.id}`} className="hover:bg-surface-variant/20 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">{log.residentLabel}</td>
                <td className="px-6 py-4 text-on-surface-variant text-xs">
                  {log.source === "anon" ? "Tablet (anon)" : "Profile"}
                </td>
                <td className="px-6 py-4">
                  <QuadrantBadge q={log.quadrant} />
                </td>
                <td className="px-6 py-4">{log.activity_type}</td>
                <td className="px-6 py-4">
                  {log.duration_seconds
                    ? `${Math.round(log.duration_seconds / 60)}m ${log.duration_seconds % 60}s`
                    : "—"}
                </td>
                <td className="px-6 py-4 text-on-surface-variant">{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QuadrantBadge({ q }: { q: string }) {
  const styles: Record<string, string> = {
    mind: "bg-primary-container/40 text-primary",
    body: "bg-secondary-container/50 text-secondary",
    soul: "bg-tertiary-container/40 text-tertiary",
    connect: "bg-surface-variant text-on-surface-variant",
  };
  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${styles[q] ?? styles.connect}`}
    >
      {q}
    </span>
  );
}
