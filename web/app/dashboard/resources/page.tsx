"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Shelter = {
  id: string;
  name: string;
  city: string;
  organization: string;
  phone: string;
  type: string;
};

export default function ResourcesPage() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("shelters").select("*").order("name");
      setShelters((data as Shelter[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = search
    ? shelters.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase())
      )
    : shelters;

  return (
    <div className="p-12 max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-primary font-bold tracking-widest text-xs uppercase">Directory of care</span>
          <h2 className="font-headline text-4xl text-on-surface mt-2">Resource Hub</h2>
          <p className="text-on-surface-variant mt-2 max-w-lg">Shelter and resource listings from the system database.</p>
        </div>
        <div className="hidden md:block w-32 h-32 rounded-full flex-shrink-0"
          style={{ background: "radial-gradient(circle, #6b6077, #e0d2ed)" }}
        >
          <div className="w-full h-full flex items-center justify-center text-white font-headline italic text-sm leading-snug text-center p-4">
            Exhale…<br />You are safe here.
          </div>
        </div>
      </header>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search shelters…"
        className="px-4 py-2 rounded-full border border-outline-variant/20 bg-white text-sm w-72 focus:ring-2 focus:ring-primary/20 outline-none"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <p className="text-on-surface-variant col-span-3 text-center py-12">Loading…</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-on-surface-variant col-span-3 text-center py-12">No shelters found.</p>
        )}
        {filtered.map((s) => (
          <article
            key={s.id}
            className="bg-white rounded-xl border border-outline-variant/10 p-6 hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-tertiary-container rounded-xl">
                <span className="material-symbols-outlined text-tertiary">home_work</span>
              </div>
              <div>
                <h3 className="font-headline text-lg text-on-surface">{s.name}</h3>
                <p className="text-xs text-on-surface-variant">{[s.city, s.type].filter(Boolean).join(" · ")}</p>
              </div>
            </div>
            {s.organization && (
              <p className="text-xs text-on-surface-variant mb-2">
                <span className="material-symbols-outlined text-xs align-text-bottom mr-1">apartment</span>
                {s.organization}
              </p>
            )}
            {s.phone && (
              <a
                href={`tel:${s.phone.replace(/[^+\d]/g, "")}`}
                className="mt-3 flex items-center gap-2 text-primary font-bold text-sm hover:underline"
              >
                <span className="material-symbols-outlined text-sm">call</span>
                {s.phone}
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
