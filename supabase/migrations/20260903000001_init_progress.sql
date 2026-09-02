-- Quality Central progress schema (Supabase / PostgreSQL)
-- Tables: users, modules, user_progress
--
-- When Supabase Auth is enabled, point users.id at auth.users(id):
--   id uuid primary key references auth.users(id) on delete cascade

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Curriculum units. Track values match the three learning tracks:
-- Manual (foundation), API, Automation.
-- Lesson rows also store category + lesson_id for /courses/[category]/[lessonId].
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  track text not null check (track in ('manual', 'api', 'automation')),
  category text not null,
  lesson_id text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint modules_lesson_unique unique (category, lesson_id)
);

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  module_id uuid not null references public.modules (id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  quiz_score numeric(5, 2)
    check (quiz_score is null or (quiz_score >= 0 and quiz_score <= 100)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_progress_user_module unique (user_id, module_id)
);

create index if not exists user_progress_user_id_idx
  on public.user_progress (user_id);

create index if not exists modules_track_sort_idx
  on public.modules (track, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists user_progress_set_updated_at on public.user_progress;
create trigger user_progress_set_updated_at
before update on public.user_progress
for each row execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.modules enable row level security;
alter table public.user_progress enable row level security;

create policy "modules_are_readable"
  on public.modules
  for select
  using (true);

create policy "users_select_own"
  on public.users
  for select
  using (auth.uid() = id);

create policy "users_update_own"
  on public.users
  for update
  using (auth.uid() = id);

create policy "progress_select_own"
  on public.user_progress
  for select
  using (auth.uid() = user_id);

create policy "progress_insert_own"
  on public.user_progress
  for insert
  with check (auth.uid() = user_id);

create policy "progress_update_own"
  on public.user_progress
  for update
  using (auth.uid() = user_id);

insert into public.modules (slug, title, description, track, category, lesson_id, sort_order)
values
  ('manual', 'Manual', 'Foundation track covering Manual QA, SDLC, and STLC', 'manual', 'foundation', null, 0),
  ('api', 'API', 'API testing track covering REST and HTTP methods', 'api', 'api-testing', null, 0),
  ('automation', 'Automation', 'UI automation track covering frameworks and the DOM', 'automation', 'ui-automation', null, 0),
  ('foundation-manual-qa', 'Manual QA', 'Test design, exploratory testing, and defect reporting', 'manual', 'foundation', 'manual-qa', 1),
  ('foundation-sdlc', 'SDLC', 'Software development life cycle and where QA fits', 'manual', 'foundation', 'sdlc', 2),
  ('foundation-stlc', 'STLC', 'Software testing life cycle from plan to closure', 'manual', 'foundation', 'stlc', 3),
  ('api-testing-rest', 'REST', 'Resources, status codes, and API contracts', 'api', 'api-testing', 'rest', 1),
  ('api-testing-http-methods', 'HTTP Methods', 'GET, POST, PUT, PATCH, DELETE, and idempotency', 'api', 'api-testing', 'http-methods', 2),
  ('ui-automation-frameworks', 'Frameworks', 'Selecting and structuring UI automation tools', 'automation', 'ui-automation', 'frameworks', 1),
  ('ui-automation-dom', 'DOM', 'Locators, accessibility trees, and stable selectors', 'automation', 'ui-automation', 'dom', 2)
on conflict (slug) do nothing;
