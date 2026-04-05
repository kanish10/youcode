"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Living Garden", icon: "local_florist" },
  { href: "/dashboard/activity-logs", label: "Activity Logs", icon: "timeline" },
  { href: "/dashboard/residents", label: "Residents", icon: "group" },
  { href: "/dashboard/resources", label: "Resource Hub", icon: "library_books" },
  { href: "/dashboard/shelter-map", label: "Shelter Map", icon: "map" },
  { href: "/tablet", label: "Shelter tablet", icon: "tablet_mac", external: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <aside className="flex flex-col h-full w-64 fixed left-0 top-0 bg-surface-container border-r border-outline-variant/15 z-50">
      <div className="px-8 py-10">
        <h1 className="text-xl font-headline text-primary tracking-wide">Bloom</h1>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1 font-medium">Staff dashboard</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
          const cls = `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                ${active
                  ? "text-primary font-bold bg-surface-variant/50 border-r-4 border-primary"
                  : "text-on-surface-variant hover:bg-surface-variant/40"
                }`;
          if ("external" in item && item.external) {
            return (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </a>
            );
          }
          return (
            <Link key={item.href} href={item.href} className={cls}>
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-outline-variant/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-on-surface-variant hover:text-error transition-colors w-full px-4 py-2 rounded-lg hover:bg-surface-variant/30"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
