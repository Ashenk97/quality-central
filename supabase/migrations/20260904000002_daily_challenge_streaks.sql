-- Daily Challenge streaks: one row per learner.

create table if not exists public.daily_challenge_streaks (
  user_id uuid primary key references public.users (id) on delete cascade,
  streak_count integer not null default 0 check (streak_count >= 0),
  last_answered_on date,
  last_challenge_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists daily_challenge_streaks_set_updated_at on public.daily_challenge_streaks;
create trigger daily_challenge_streaks_set_updated_at
before update on public.daily_challenge_streaks
for each row execute function public.set_updated_at();

alter table public.daily_challenge_streaks enable row level security;

drop policy if exists "daily_streak_select_own" on public.daily_challenge_streaks;
create policy "daily_streak_select_own"
  on public.daily_challenge_streaks
  for select
  using (auth.uid() = user_id);

drop policy if exists "daily_streak_insert_own" on public.daily_challenge_streaks;
create policy "daily_streak_insert_own"
  on public.daily_challenge_streaks
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "daily_streak_update_own" on public.daily_challenge_streaks;
create policy "daily_streak_update_own"
  on public.daily_challenge_streaks
  for update
  using (auth.uid() = user_id);
