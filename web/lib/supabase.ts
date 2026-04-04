import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type Profile = {
  id: string;
  role: "resident" | "staff" | "admin";
  display_name: string;
  shelter_id: string | null;
  unique_code: string;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  session_id: string | null;
  user_id: string;
  quadrant: "mind" | "body" | "soul" | "connect";
  activity_type: string;
  duration_seconds: number;
  completed: boolean;
  created_at: string;
  profiles?: { display_name: string; unique_code: string };
};

export type Flower = {
  id: string;
  user_id: string;
  quadrant: string;
  color_hex: string;
  created_at: string;
};

export type SessionRow = {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  mood: string | null;
  language: string;
};
