import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bloom — Shelter tablet",
  description: "Optional ID wellness kiosk for shelter common areas",
};

export default function TabletLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-surface text-on-surface">{children}</div>;
}
