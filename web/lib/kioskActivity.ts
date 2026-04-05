export type KioskLogResult = {
  ok: boolean;
  anonymous?: boolean;
  matched?: boolean;
  error?: string;
};

/**
 * Log an activity completion via the server-side API route.
 * The API route uses the service role key to bypass RLS.
 */
export async function logKioskActivity(params: {
  identifier: string;
  quadrant: "mind" | "body" | "soul" | "connect";
  activityType: string;
  durationSeconds?: number;
  addFlower?: boolean;
  colorHex?: string;
}): Promise<KioskLogResult> {
  try {
    const res = await fetch("/api/log-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: params.identifier.trim(),
        quadrant: params.quadrant,
        activityType: params.activityType,
        durationSeconds: params.durationSeconds ?? 0,
        addFlower: params.addFlower ?? false,
        colorHex: params.colorHex ?? "#8FA89B",
      }),
    });
    const data = await res.json();
    return {
      ok: data.ok === true,
      anonymous: data.anonymous === true,
      matched: data.matched === true,
      error: data.error,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Network error";
    return { ok: false, error: msg };
  }
}

/**
 * Simple activity logger for resident pages (no identifier).
 */
export async function logResidentActivity(params: {
  quadrant: "mind" | "body" | "soul" | "connect";
  activityType: string;
  durationSeconds?: number;
}): Promise<boolean> {
  try {
    const res = await fetch("/api/log-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quadrant: params.quadrant,
        activityType: params.activityType,
        durationSeconds: params.durationSeconds ?? 0,
      }),
    });
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
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
