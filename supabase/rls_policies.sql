-- Row Level Security policies for Bloom
-- Run after schema.sql in the Supabase SQL editor.

alter table profiles enable row level security;
alter table sessions enable row level security;
alter table activity_logs enable row level security;
alter table flowers enable row level security;
alter table gratitude_notes enable row level security;
alter table shelters enable row level security;

-- Helper: check if current user is staff or admin
create or replace function is_staff_or_admin()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('staff', 'admin')
  );
$$ language sql security definer;

-- PROFILES
create policy "Users read own profile"
  on profiles for select using (id = auth.uid());
create policy "Staff read all profiles"
  on profiles for select using (is_staff_or_admin());
create policy "Users update own profile"
  on profiles for update using (id = auth.uid());

-- SESSIONS
create policy "Users manage own sessions"
  on sessions for all using (user_id = auth.uid());
create policy "Staff read all sessions"
  on sessions for select using (is_staff_or_admin());

-- ACTIVITY_LOGS
create policy "Users manage own activity logs"
  on activity_logs for all using (user_id = auth.uid());
create policy "Staff read all activity logs"
  on activity_logs for select using (is_staff_or_admin());

-- FLOWERS
create policy "Users manage own flowers"
  on flowers for all using (user_id = auth.uid());
create policy "Anyone can read flowers (garden is public)"
  on flowers for select using (true);

-- GRATITUDE_NOTES
create policy "Users manage own notes"
  on gratitude_notes for all using (user_id = auth.uid());
create policy "Anyone reads public notes"
  on gratitude_notes for select using (is_public = true);
create policy "Staff read all notes"
  on gratitude_notes for select using (is_staff_or_admin());

-- SHELTERS
create policy "Anyone can read shelters"
  on shelters for select using (true);
create policy "Staff manage shelters"
  on shelters for all using (is_staff_or_admin());
