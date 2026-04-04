"use client";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: string;
  tint: "primary" | "secondary" | "tertiary";
};

const tintMap = {
  primary: { bg: "bg-primary-container/30", text: "text-primary", icon: "text-primary" },
  secondary: { bg: "bg-secondary-container/40", text: "text-secondary", icon: "text-secondary" },
  tertiary: { bg: "bg-tertiary-container/30", text: "text-tertiary", icon: "text-tertiary" },
};

export function StatCard({ label, value, icon, tint }: StatCardProps) {
  const t = tintMap[tint];
  return (
    <div className={`${t.bg} rounded-xl p-6 flex items-center gap-4`}>
      <div className={`p-3 rounded-xl bg-white/60 ${t.icon}`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-3xl font-bold text-on-surface">{value}</p>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest font-medium mt-1">{label}</p>
      </div>
    </div>
  );
}

export function StatCardRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{children}</div>;
}
