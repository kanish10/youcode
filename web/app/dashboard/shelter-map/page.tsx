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
  address?: string;
  latitude?: number;
  longitude?: number;
};

// Fallback shelter data for when Supabase doesn't have coordinates
const SHELTER_DEFAULTS: Omit<Shelter, "id">[] = [
  { name: "Atira Women's Resource Society", city: "Vancouver", organization: "Atira", phone: "604-331-1407", type: "transition_house", address: "101 E Cordova St, Vancouver", latitude: 49.2824, longitude: -123.0991 },
  { name: "Battered Women's Support Services", city: "Vancouver", organization: "BWSS", phone: "604-687-1867", type: "safe_home", address: "Vancouver, BC", latitude: 49.2607, longitude: -123.1135 },
  { name: "YWCA Crabtree Corner", city: "Vancouver", organization: "YWCA", phone: "604-216-1699", type: "transition_house", address: "101 E Cordova St, Vancouver", latitude: 49.2823, longitude: -123.0990 },
  { name: "Salvation Army Belkin House", city: "Vancouver", organization: "Salvation Army", phone: "604-681-3405", type: "emergency_shelter", address: "555 Homer St, Vancouver", latitude: 49.2833, longitude: -123.1122 },
  { name: "Bloom Shelter – Main", city: "Vancouver", organization: "Bloom", phone: "604-555-0100", type: "transition_house", address: "609 Helmcken St, Vancouver", latitude: 49.2769, longitude: -123.1222 },
  { name: "Ishtar Transition Housing", city: "Langley", organization: "Ishtar", phone: "604-530-9442", type: "transition_house", address: "Langley, BC", latitude: 49.1044, longitude: -122.6606 },
  { name: "Cythera Transition House", city: "Surrey", organization: "OPTIONS", phone: "604-572-7366", type: "transition_house", address: "Surrey, BC", latitude: 49.1913, longitude: -122.8490 },
  { name: "Haven Transition House", city: "Chilliwack", organization: "Ann Davis Society", phone: "604-792-2760", type: "transition_house", address: "Chilliwack, BC", latitude: 49.1579, longitude: -121.9514 },
  { name: "Powell Place Transition House", city: "New Westminster", organization: "YWCA", phone: "604-525-1377", type: "transition_house", address: "New Westminster, BC", latitude: 49.2057, longitude: -122.9110 },
  { name: "Marguerite Dixon House", city: "Burnaby", organization: "Dixon Society", phone: "604-298-3454", type: "safe_home", address: "Burnaby, BC", latitude: 49.2488, longitude: -122.9805 },
];

export default function ShelterMapPage() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [selected, setSelected] = useState<Shelter | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("shelters").select("*").order("name");
      let shelterData = (data as Shelter[]) ?? [];

      // If no shelters from DB or they lack coordinates, use defaults
      if (shelterData.length === 0) {
        shelterData = SHELTER_DEFAULTS.map((s, i) => ({ ...s, id: `default-${i}` }));
      } else {
        // Merge coordinates from defaults for shelters that lack them
        shelterData = shelterData.map((s) => {
          if (!s.latitude || !s.longitude) {
            const match = SHELTER_DEFAULTS.find((d) => d.name === s.name || d.city === s.city);
            if (match) return { ...s, latitude: match.latitude, longitude: match.longitude, address: s.address || match.address };
          }
          return s;
        });
      }
      setShelters(shelterData);
      setLoading(false);
    })();
  }, []);

  const filtered = search
    ? shelters.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase()) ||
        s.organization?.toLowerCase().includes(search.toLowerCase())
      )
    : shelters;

  const mapCenter = selected
    ? `${selected.latitude},${selected.longitude}`
    : "49.2827,-123.1207";
  const mapZoom = selected ? 15 : 10;

  const mapEmbedUrl = selected
    ? `https://www.google.com/maps?q=${selected.latitude},${selected.longitude}&z=${mapZoom}&output=embed`
    : `https://www.google.com/maps?q=${mapCenter}&z=${mapZoom}&output=embed`;

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header>
        <span className="text-primary font-bold tracking-widest text-xs uppercase">Network Overview</span>
        <h2 className="font-headline text-4xl text-on-surface mt-2 font-bold">Shelter Map</h2>
        <p className="text-on-surface-variant mt-2 max-w-lg">
          View shelter locations across the region. Click a shelter to see details and open directions in Google Maps.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar: Shelter List */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shelters…"
              className="w-full px-4 py-3 pl-10 rounded-xl border border-outline-variant/20 bg-white text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          {/* Shelter Cards */}
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {loading && <p className="text-on-surface-variant text-center py-8">Loading shelters…</p>}
            {!loading && filtered.length === 0 && <p className="text-on-surface-variant text-center py-8">No shelters found.</p>}
            {filtered.map((s) => {
              const isSelected = selected?.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(isSelected ? null : s)}
                  className={`w-full text-left rounded-xl p-4 border transition-all ${
                    isSelected
                      ? "bg-primary-container/40 border-primary shadow-md"
                      : "bg-white border-outline-variant/10 hover:shadow-sm hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-primary text-white" : "bg-tertiary-container text-tertiary"}`}>
                      <span className="material-symbols-outlined text-lg">home_work</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-headline text-sm font-semibold text-on-surface truncate">{s.name}</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">{s.city} · {typeLabel(s.type)}</p>
                      {s.phone && (
                        <p className="text-xs text-primary mt-1 font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">call</span>
                          {s.phone}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-primary text-lg shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map Area */}
        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-2xl overflow-hidden border border-outline-variant/20 shadow-sm">
            {/* Map Embed */}
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={mapEmbedUrl}
                title="Shelter Map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* Selected Shelter Detail Panel */}
            {selected && (
              <div className="bg-white p-6 border-t border-outline-variant/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-headline text-xl font-bold text-on-surface">{selected.name}</h3>
                    <p className="text-sm text-on-surface-variant mt-1">{selected.organization}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-full hover:bg-surface-container shrink-0"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant">close</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {selected.address && (
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-lg mt-0.5">location_on</span>
                      <div>
                        <p className="text-xs text-on-surface-variant uppercase tracking-widest font-medium">Address</p>
                        <p className="text-sm text-on-surface mt-0.5">{selected.address}</p>
                      </div>
                    </div>
                  )}
                  {selected.phone && (
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-lg mt-0.5">call</span>
                      <div>
                        <p className="text-xs text-on-surface-variant uppercase tracking-widest font-medium">Phone</p>
                        <a href={`tel:${selected.phone.replace(/[^+\d]/g, "")}`} className="text-sm text-primary font-medium mt-0.5 block hover:underline">
                          {selected.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">category</span>
                    <div>
                      <p className="text-xs text-on-surface-variant uppercase tracking-widest font-medium">Type</p>
                      <p className="text-sm text-on-surface mt-0.5 capitalize">{typeLabel(selected.type)}</p>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full py-3 bg-primary text-on-primary rounded-xl flex items-center justify-center gap-2 font-semibold text-sm active:scale-[0.98] transition-transform hover:bg-primary/90"
                >
                  <span className="material-symbols-outlined text-lg">directions</span>
                  Open in Google Maps
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function typeLabel(type: string) {
  switch (type) {
    case "transition_house": return "Transition House";
    case "safe_home": return "Safe Home";
    case "emergency_shelter": return "Emergency Shelter";
    default: return type.replace(/_/g, " ");
  }
}
