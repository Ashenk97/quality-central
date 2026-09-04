-- Student-defined mock HTTP endpoints (slug + method).

create table if not exists public.mock_endpoints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  slug text not null,
  method text not null check (method in ('GET', 'POST', 'PUT')),
  status_code integer not null check (status_code >= 100 and status_code <= 599),
  response_body jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mock_endpoints_slug_method unique (slug, method)
);

create index if not exists mock_endpoints_user_id_idx
  on public.mock_endpoints (user_id);

create index if not exists mock_endpoints_slug_idx
  on public.mock_endpoints (slug);

drop trigger if exists mock_endpoints_set_updated_at on public.mock_endpoints;
create trigger mock_endpoints_set_updated_at
before update on public.mock_endpoints
for each row execute function public.set_updated_at();

alter table public.mock_endpoints enable row level security;

drop policy if exists "mock_endpoints_select_all" on public.mock_endpoints;
create policy "mock_endpoints_select_all"
  on public.mock_endpoints
  for select
  using (true);

drop policy if exists "mock_endpoints_insert_own" on public.mock_endpoints;
create policy "mock_endpoints_insert_own"
  on public.mock_endpoints
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "mock_endpoints_update_own" on public.mock_endpoints;
create policy "mock_endpoints_update_own"
  on public.mock_endpoints
  for update
  using (auth.uid() = user_id);

drop policy if exists "mock_endpoints_delete_own" on public.mock_endpoints;
create policy "mock_endpoints_delete_own"
  on public.mock_endpoints
  for delete
  using (auth.uid() = user_id);
