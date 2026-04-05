import { createClient } from "@/lib/supabase";

export type KioskLogResult = {
  ok: boolean;
  anonymous?: boolean;
  matched?: boolean;
  error?: string;
};

/**
 * Log an activity completion. Always writes to kiosk_anonymous_events
 * (the universal activity log). If an identifier is provided and matches
 * a profile, also writes to activity_logs and flowers for that resident.
 */
export async function logKioskActivity(params: {
  identifier: string;
  quadrant: "mind" | "body" | "soul" | "connect";
  activityType: string;
  durationSeconds?: number;
  addFlower?: boolean;
  colorHex?: string;
}): Promise<KioskLogResult> {
  const supabase = createClient();
  const id = params.identifier.trim();

  try {
    // 1. Always log to kiosk_anonymous_events (universal activity log)
    const { error: anonErr } = await supabase
      .from("kiosk_anonymous_events")
      .insert({
        quadrant: params.quadrant,
        activity_type: params.activityType,
        duration_seconds: params.durationSeconds ?? 0,
      });

    if (anonErr) {
      return { ok: false, error: anonErr.message };
    }

    // 2. If identifier provided, try to match a profile
    if (id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .or(`unique_code.eq.${id},display_name.eq.${id}`)
        .limit(1)
        .maybeSingle();

      if (profile) {
        await supabase.from("activity_logs").insert({
          user_id: profile.id,
          quadrant: params.quadrant,
          activity_type: params.activityType,
          duration_seconds: params.durationSeconds ?? 0,
          completed: true,
        });

        if (params.addFlower) {
          await supabase.from("flowers").insert({
            user_id: profile.id,
            quadrant: params.quadrant,
            color_hex: params.colorHex ?? "#8FA89B",
          });
        }

        return { ok: true, anonymous: false, matched: true };
      }

      return { ok: true, anonymous: true, matched: false };
    }

    return { ok: true, anonymous: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: msg };
  }
}

/**
 * Simple activity logger for resident pages. Writes to kiosk_anonymous_events.
 */
export async function logResidentActivity(params: {
  quadrant: "mind" | "body" | "soul" | "connect";
  activityType: string;
  durationSeconds?: number;
}): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("kiosk_anonymous_events").insert({
    quadrant: params.quadrant,
    activity_type: params.activityType,
    duration_seconds: params.durationSeconds ?? 0,
  });
  return !error;
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
