import { createClient } from "@/lib/supabase";

export type KioskLogResult = {
  ok: boolean;
  anonymous?: boolean;
  matched?: boolean;
  error?: string;
};

export async function logKioskActivity(params: {
  identifier: string;
  quadrant: "mind" | "body" | "soul" | "connect";
  activityType: string;
  durationSeconds?: number;
  addFlower?: boolean;
  colorHex?: string;
}): Promise<KioskLogResult> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("log_shelter_activity", {
    p_identifier: params.identifier.trim(),
    p_quadrant: params.quadrant,
    p_activity_type: params.activityType,
    p_duration_seconds: params.durationSeconds ?? 0,
    p_completed: true,
    p_add_flower: params.addFlower ?? false,
    p_color_hex: params.colorHex ?? "#8FA89B",
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  const row = data as Record<string, unknown> | null;
  return {
    ok: row?.ok === true,
    anonymous: row?.anonymous === true,
    matched: row?.matched === true,
  };
}

export const KIOSK_ID_KEY = "bloom_kiosk_identifier";

export function getStoredKioskIdentifier(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(KIOSK_ID_KEY) ?? "";
}

export function setStoredKioskIdentifier(id: string) {
  if (typeof window === "undefined") return;
  if (id.trim()) sessionStorage.setItem(KIOSK_ID_KEY, id.trim());
  else sessionStorage.removeItem(KIOSK_ID_KEY);
}
