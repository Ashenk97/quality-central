-- Learners can report lesson comments. Three reports from different learners
-- hide a comment from everyone except its author. Clear hidden_at to restore it.

alter table public.lesson_comments
  add column if not exists hidden_at timestamptz;

create or replace function public.lesson_comments_clear_hidden()
returns trigger
language plpgsql
as $$
begin
  new.hidden_at := null;
  return new;
end;
$$;

drop trigger if exists lesson_comments_clear_hidden on public.lesson_comments;
create trigger lesson_comments_clear_hidden
  before insert on public.lesson_comments
  for each row execute function public.lesson_comments_clear_hidden();

drop policy if exists "lesson_comments_select" on public.lesson_comments;
create policy "lesson_comments_select"
  on public.lesson_comments
  for select
  using (hidden_at is null or auth.uid() = user_id);

create table if not exists public.lesson_comment_reports (
  comment_id uuid not null references public.lesson_comments (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create index if not exists lesson_comment_reports_user_idx
  on public.lesson_comment_reports (user_id);

create or replace function public.lesson_comment_reports_guard()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from public.lesson_comments
    where id = new.comment_id
      and user_id = new.user_id
  ) then
    raise exception 'You cannot report your own comment';
  end if;
  return new;
end;
$$;

drop trigger if exists lesson_comment_reports_guard on public.lesson_comment_reports;
create trigger lesson_comment_reports_guard
  before insert on public.lesson_comment_reports
  for each row execute function public.lesson_comment_reports_guard();

create or replace function public.lesson_comment_reports_hide()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  hide_threshold constant integer := 3;
begin
  if (
    select count(*)
    from public.lesson_comment_reports
    where comment_id = new.comment_id
  ) >= hide_threshold then
    update public.lesson_comments
      set hidden_at = coalesce(hidden_at, now())
      where id = new.comment_id;
  end if;
  return new;
end;
$$;

drop trigger if exists lesson_comment_reports_hide on public.lesson_comment_reports;
create trigger lesson_comment_reports_hide
  after insert on public.lesson_comment_reports
  for each row execute function public.lesson_comment_reports_hide();

alter table public.lesson_comment_reports enable row level security;

drop policy if exists "lesson_comment_reports_select_own" on public.lesson_comment_reports;
create policy "lesson_comment_reports_select_own"
  on public.lesson_comment_reports
  for select
  using (auth.uid() = user_id);

drop policy if exists "lesson_comment_reports_insert_own" on public.lesson_comment_reports;
create policy "lesson_comment_reports_insert_own"
  on public.lesson_comment_reports
  for insert
  with check (auth.uid() = user_id);
