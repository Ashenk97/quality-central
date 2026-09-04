-- Beta feedback inbox + first-run welcome flag.

alter table public.users
  add column if not exists beta_welcome_seen_at timestamptz;

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete set null,
  kind text not null check (kind in ('bug', 'ux')),
  message text not null check (char_length(btrim(message)) between 8 and 2000),
  page_path text,
  viewport text,
  created_at timestamptz not null default now()
);

create index if not exists feedback_created_at_idx
  on public.feedback (created_at desc);

alter table public.feedback enable row level security;

drop policy if exists "feedback_insert_beta" on public.feedback;
create policy "feedback_insert_beta"
  on public.feedback
  for insert
  with check (
    user_id is null
    or user_id = auth.uid()
  );

drop policy if exists "feedback_select_own" on public.feedback;
create policy "feedback_select_own"
  on public.feedback
  for select
  using (auth.uid() = user_id);
