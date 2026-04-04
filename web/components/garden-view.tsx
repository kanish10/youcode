"use client";

import { Flower } from "@/lib/supabase";

const QUADRANT_COLORS: Record<string, string> = {
  mind: "#52695e",
  body: "#A89B8F",
  soul: "#6b6077",
  connect: "#b8a88a",
};

const ICONS: Record<string, string> = {
  mind: "psychology",
  body: "self_improvement",
  soul: "auto_awesome",
  connect: "diversity_3",
};

export default function GardenView({ flowers }: { flowers: Flower[] }) {
  const quadrants = ["mind", "body", "soul", "connect"];
  const grouped = quadrants.map((q) => ({
    quadrant: q,
    count: flowers.filter((f) => f.quadrant === q).length,
  }));
  const total = flowers.length;

  return (
    <div className="w-full">
      <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden mb-8"
        style={{ background: "radial-gradient(circle at 50% 120%, #cee9da 0%, transparent 70%)" }}
      >
        <div className="absolute inset-0 flex items-end justify-around pb-8 px-12">
          {grouped.map((g) => (
            <div key={g.quadrant} className="flex flex-col items-center gap-2">
              {Array.from({ length: Math.min(g.count, 5) }).map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined flower-sway"
                  style={{
                    color: QUADRANT_COLORS[g.quadrant],
                    fontSize: `${28 + i * 6}px`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                >
                  {ICONS[g.quadrant]}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center">
          <div className="flex gap-4 bg-white/80 backdrop-blur px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-on-surface-variant/70">
            {grouped.map((g) => (
              <span key={g.quadrant} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: QUADRANT_COLORS[g.quadrant] }}
                />
                {g.quadrant} ({g.count})
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-2">Growth progress</p>
        <p className="text-5xl font-light text-on-surface">
          {total} <span className="text-2xl text-on-surface-variant/60 ml-2">total blooms</span>
        </p>
      </div>
    </div>
  );
}
