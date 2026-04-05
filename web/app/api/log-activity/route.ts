import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { quadrant, activityType, durationSeconds, identifier, addFlower, colorHex } = body;

  if (!quadrant || !activityType) {
    return NextResponse.json({ ok: false, error: "Missing quadrant or activityType" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer service role key (bypasses RLS); fall back to anon key
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Always log to kiosk_anonymous_events (universal activity ledger)
  const { error: insertErr } = await supabase.from("kiosk_anonymous_events").insert({
    quadrant,
    activity_type: activityType,
    duration_seconds: durationSeconds ?? 0,
  });

  if (insertErr) {
    return NextResponse.json({ ok: false, error: insertErr.message }, { status: 500 });
  }

  let matched = false;
  const id = (identifier || "").trim();

  // 2. If identifier provided, try to match a resident profile
  if (id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .or(`unique_code.eq.${id},display_name.eq.${id}`)
      .limit(1)
      .maybeSingle();

    if (profile) {
      matched = true;
      await supabase.from("activity_logs").insert({
        user_id: profile.id,
        quadrant,
        activity_type: activityType,
        duration_seconds: durationSeconds ?? 0,
        completed: true,
      });

      if (addFlower) {
        await supabase.from("flowers").insert({
          user_id: profile.id,
          quadrant,
          color_hex: colorHex ?? "#8FA89B",
        });
      }
    }
  }

  return NextResponse.json({ ok: true, anonymous: !matched, matched });
}
