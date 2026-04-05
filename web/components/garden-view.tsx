"use client";

import { Flower } from "@/lib/supabase";

/* ── Flower cluster definitions matching the design reference ─── */
const CLUSTER_ICONS = {
  soul: [
    { icon: "yard", size: "!text-6xl", mb: "mb-2", delay: "0.2s", opacity: "opacity-80" },
    { icon: "filter_vintage", size: "!text-5xl", mb: "mb-6", delay: "1.5s", opacity: "" },
    { icon: "spa", size: "!text-7xl", mb: "mb-1", delay: "0.8s", opacity: "opacity-90" },
  ],
  mind: [
    { icon: "psychiatry", size: "!text-6xl", mb: "mb-8", delay: "0.5s", opacity: "opacity-90" },
    { icon: "local_florist", size: "!text-8xl", mb: "mb-4", delay: "0s", opacity: "" },
    { icon: "psychology", size: "!text-5xl", mb: "mb-12", delay: "2.1s", opacity: "opacity-80" },
    { icon: "eco", size: "!text-7xl", mb: "mb-2", delay: "1.2s", opacity: "" },
  ],
  body: [
    { icon: "nature", size: "!text-5xl", mb: "mb-4", delay: "0.3s", opacity: "opacity-90" },
    { icon: "self_improvement", size: "!text-7xl", mb: "mb-2", delay: "1.8s", opacity: "" },
    { icon: "water_drop", size: "!text-6xl", mb: "mb-6", delay: "0.9s", opacity: "opacity-80" },
  ],
};

export default function GardenView({ flowers }: { flowers: Flower[] }) {
  const total = flowers.length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Garden meadow */}
      <div
        className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden border border-outline-variant/20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 120%, #D6E5E3 0%, #E3EBE1 35%, transparent 80%)",
        }}
      >
        <div className="absolute inset-0 flex items-end justify-around pb-4 px-12">
          {/* Soul cluster (left) */}
          <div className="flex items-end -space-x-4">
            {CLUSTER_ICONS.soul.map((f, i) => (
              <div
                key={i}
                className={`flower-sway ${f.mb} ${f.opacity}`}
                style={{ animationDelay: f.delay }}
              >
                <span className={`material-symbols-outlined ${f.size} flower-soul`}>
                  {f.icon}
                </span>
              </div>
            ))}
          </div>

          {/* Mind cluster (center, tallest) */}
          <div className="flex items-end -space-x-6 z-10">
            {CLUSTER_ICONS.mind.map((f, i) => (
              <div
                key={i}
                className={`flower-sway ${f.mb} ${f.opacity}`}
                style={{ animationDelay: f.delay }}
              >
                <span className={`material-symbols-outlined ${f.size} flower-mind`}>
                  {f.icon}
                </span>
              </div>
            ))}
          </div>

          {/* Body cluster (right) */}
          <div className="flex items-end -space-x-4">
            {CLUSTER_ICONS.body.map((f, i) => (
              <div
                key={i}
                className={`flower-sway ${f.mb} ${f.opacity}`}
                style={{ animationDelay: f.delay }}
              >
                <span className={`material-symbols-outlined ${f.size} flower-body`}>
                  {f.icon}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6">
          <div className="flex gap-6 bg-surface/80 backdrop-blur-md px-6 py-2 rounded-full border border-outline-variant/20 text-xs font-bold uppercase tracking-widest text-on-surface-variant/80">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Mind
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block" /> Body
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary inline-block" /> Soul
            </span>
          </div>
        </div>
      </div>

      {/* Growth Progress */}
      <div className="text-center mt-10 max-w-2xl">
        <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
          Growth Progress
        </p>
        <p className="text-6xl font-light text-on-surface tracking-tight">
          {total}{" "}
          <span className="text-3xl text-on-surface-variant/60 ml-2">
            Total Blooms Today
          </span>
        </p>
        <p className="text-sm text-on-surface-variant mt-4 leading-relaxed max-w-lg mx-auto">
          Each bloom represents a connection made, a moment of rest, or a step
          toward wellness. As our residents participate, our digital garden
          flourishes in real-time.
        </p>
      </div>
    </div>
  );
}
