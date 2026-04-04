"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type ResidentRow = {
  user_id: string;
  unique_code: string;
  display_name: string;
  role: string;
  shelter_name: string | null;
  total_activities: number;
  total_flowers: number;
  last_activity_at: string | null;
};

export default function ResidentsPage() {
  const [residents, setResidents] = useState<ResidentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("user_activity_summary").select("*").order("last_activity_at", { ascending: false });
      setResidents((data as ResidentRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = search
    ? residents.filter((r) =>
        r.unique_code?.toLowerCase().includes(search.toLowerCase()) ||
        r.display_name?.toLowerCase().includes(search.toLowerCase())
      )
    : residents;

  return (
    <div className="p-12 max-w-6xl mx-auto space-y-8">
      <header>
        <span className="text-primary font-bold tracking-widest text-xs uppercase">Directory</span>
        <h2 className="font-headline text-4xl text-on-surface mt-2">Residents</h2>
        <p className="text-on-surface-variant mt-2">Anonymized overview of all registered residents and their engagement.</p>
      </header>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by ID or name…"
        className="px-4 py-2 rounded-full border border-outline-variant/20 bg-white text-sm w-72 focus:ring-2 focus:ring-primary/20 outline-none"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <p className="text-on-surface-variant col-span-3 text-center py-12">Loading…</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-on-surface-variant col-span-3 text-center py-12">No residents found.</p>
        )}
        {filtered.map((r) => (
          <div
            key={r.user_id}
            className="bg-white rounded-xl border border-outline-variant/10 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">person</span>
              </div>
              <div>
                <p className="font-bold text-on-surface">{r.display_name}</p>
                <p className="text-xs font-mono text-on-surface-variant">{r.unique_code}</p>
              </div>
              <span className={`ml-auto px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                r.role === "staff" ? "bg-primary-container/60 text-primary" : "bg-surface-variant text-on-surface-variant"
              }`}>
                {r.role}
              </span>
            </div>
            {r.shelter_name && (
              <p className="text-xs text-on-surface-variant mb-3">
                <span className="material-symbols-outlined text-xs align-text-bottom mr-1">home</span>
                {r.shelter_name}
              </p>
            )}
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-2xl font-bold text-on-surface">{r.total_activities}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Activities</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-on-surface">{r.total_flowers}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Blooms</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-on-surface-variant">Last active</p>
                <p className="text-xs font-medium text-on-surface">
                  {r.last_activity_at ? new Date(r.last_activity_at).toLocaleDateString() : "Never"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
