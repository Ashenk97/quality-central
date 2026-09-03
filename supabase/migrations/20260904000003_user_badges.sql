-- Achievement badges earned by a learner (Bug Hunter, API Wizard, …).

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  constraint user_badges_user_badge unique (user_id, badge_id)
);

create index if not exists user_badges_user_id_idx
  on public.user_badges (user_id);

alter table public.user_badges enable row level security;

drop policy if exists "user_badges_select_own" on public.user_badges;
create policy "user_badges_select_own"
  on public.user_badges
  for select
  using (auth.uid() = user_id);

drop policy if exists "user_badges_insert_own" on public.user_badges;
create policy "user_badges_insert_own"
  on public.user_badges
  for insert
  with check (auth.uid() = user_id);
