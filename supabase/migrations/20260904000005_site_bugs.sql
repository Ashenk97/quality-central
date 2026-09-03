-- Real platform bugs found on Quality Central (not sandbox training defects).

create table if not exists public.site_bugs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete set null,
  title text not null check (char_length(btrim(title)) between 4 and 120),
  details text not null check (char_length(btrim(details)) between 8 and 2000),
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high')),
  page_path text,
  viewport text,
  created_at timestamptz not null default now()
);

create index if not exists site_bugs_created_at_idx
  on public.site_bugs (created_at desc);

alter table public.site_bugs enable row level security;

drop policy if exists "site_bugs_insert" on public.site_bugs;
create policy "site_bugs_insert"
  on public.site_bugs
  for insert
  with check (
    user_id is null
    or user_id = auth.uid()
  );

drop policy if exists "site_bugs_select_own" on public.site_bugs;
create policy "site_bugs_select_own"
  on public.site_bugs
  for select
  using (auth.uid() = user_id);
