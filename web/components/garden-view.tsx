"use client";

/* ── Flower cluster definitions — more icons for finer growth ─── */
const CLUSTER_ICONS = {
  soul: [
    { icon: "yard", size: "!text-5xl", mb: "mb-2", delay: "0.2s", opacity: "opacity-80" },
    { icon: "filter_vintage", size: "!text-4xl", mb: "mb-6", delay: "1.5s", opacity: "" },
    { icon: "spa", size: "!text-6xl", mb: "mb-1", delay: "0.8s", opacity: "opacity-90" },
    { icon: "eco", size: "!text-5xl", mb: "mb-4", delay: "1.8s", opacity: "opacity-85" },
    { icon: "nest_eco_leaf", size: "!text-4xl", mb: "mb-8", delay: "2.4s", opacity: "opacity-75" },
  ],
  mind: [
    { icon: "psychiatry", size: "!text-5xl", mb: "mb-8", delay: "0.5s", opacity: "opacity-90" },
    { icon: "local_florist", size: "!text-7xl", mb: "mb-4", delay: "0s", opacity: "" },
    { icon: "psychology", size: "!text-4xl", mb: "mb-12", delay: "2.1s", opacity: "opacity-80" },
    { icon: "eco", size: "!text-6xl", mb: "mb-2", delay: "1.2s", opacity: "" },
    { icon: "forest", size: "!text-5xl", mb: "mb-6", delay: "1.7s", opacity: "opacity-85" },
    { icon: "filter_vintage", size: "!text-4xl", mb: "mb-10", delay: "2.5s", opacity: "opacity-75" },
  ],
  body: [
    { icon: "nature", size: "!text-4xl", mb: "mb-4", delay: "0.3s", opacity: "opacity-90" },
    { icon: "self_improvement", size: "!text-6xl", mb: "mb-2", delay: "1.8s", opacity: "" },
    { icon: "water_drop", size: "!text-5xl", mb: "mb-6", delay: "0.9s", opacity: "opacity-80" },
    { icon: "grass", size: "!text-5xl", mb: "mb-3", delay: "1.4s", opacity: "opacity-85" },
    { icon: "potted_plant", size: "!text-4xl", mb: "mb-8", delay: "2.2s", opacity: "opacity-75" },
  ],
};

type QuadrantCounts = { mind: number; body: number; soul: number; connect: number };

/** Determine how many icons to show for a cluster based on activity count */
function visibleIcons(quadrant: "mind" | "body" | "soul", count: number): number {
  const max = CLUSTER_ICONS[quadrant].length;
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return Math.min(2, max);
  if (count <= 6) return Math.min(3, max);
  if (count <= 10) return Math.min(4, max);
  if (count <= 15) return Math.min(5, max);
  return max;
}

export default function GardenView({
  totalBlooms,
  quadrantCounts,
}: {
  totalBlooms: number;
  quadrantCounts: QuadrantCounts;
}) {
  const hasAnyActivity = totalBlooms > 0;

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
          {hasAnyActivity ? (
            <>
              {/* Soul cluster (left) */}
              <div className="flex items-end -space-x-4">
                {CLUSTER_ICONS.soul
                  .slice(0, visibleIcons("soul", quadrantCounts.soul))
                  .map((f, i) => (
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
                {CLUSTER_ICONS.mind
                  .slice(0, visibleIcons("mind", quadrantCounts.mind))
                  .map((f, i) => (
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
                {CLUSTER_ICONS.body
                  .slice(0, visibleIcons("body", quadrantCounts.body))
                  .map((f, i) => (
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
            </>
          ) : (
            /* Empty garden — show a seed waiting to bloom */
            <div className="flex items-end justify-center w-full pb-4">
              <div className="flower-sway opacity-40">
                <span className="material-symbols-outlined !text-5xl flower-mind">
                  local_florist
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Legend — top-left to avoid overlapping flowers */}
        <div className="absolute top-6 left-6 z-20">
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
          {totalBlooms}{" "}
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
