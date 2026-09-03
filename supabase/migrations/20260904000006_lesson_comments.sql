-- Nested lesson discussion: questions, one-level replies, and upvotes.

create table if not exists public.lesson_comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  category text not null check (char_length(btrim(category)) between 1 and 80),
  lesson_id text not null check (char_length(btrim(lesson_id)) between 1 and 120),
  parent_id uuid references public.lesson_comments (id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 8 and 2000),
  author_name text not null check (char_length(btrim(author_name)) between 1 and 80),
  vote_count integer not null default 0 check (vote_count >= 0),
  created_at timestamptz not null default now()
);

create index if not exists lesson_comments_lesson_idx
  on public.lesson_comments (category, lesson_id, created_at);

create index if not exists lesson_comments_parent_idx
  on public.lesson_comments (parent_id);

create table if not exists public.lesson_comment_votes (
  comment_id uuid not null references public.lesson_comments (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create index if not exists lesson_comment_votes_user_idx
  on public.lesson_comment_votes (user_id);

create or replace function public.lesson_comments_prepare()
returns trigger
language plpgsql
as $$
begin
  new.vote_count := 0;
  new.body := btrim(new.body);
  new.author_name := btrim(new.author_name);
  new.category := btrim(new.category);
  new.lesson_id := btrim(new.lesson_id);

  if new.parent_id is not null then
    if not exists (
      select 1
      from public.lesson_comments parent
      where parent.id = new.parent_id
        and parent.parent_id is null
        and parent.category = new.category
        and parent.lesson_id = new.lesson_id
    ) then
      raise exception 'Replies must target a top-level comment on the same lesson';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists lesson_comments_prepare on public.lesson_comments;
create trigger lesson_comments_prepare
  before insert on public.lesson_comments
  for each row execute function public.lesson_comments_prepare();

create or replace function public.lesson_comment_votes_guard()
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
    raise exception 'You cannot upvote your own comment';
  end if;
  return new;
end;
$$;

drop trigger if exists lesson_comment_votes_guard on public.lesson_comment_votes;
create trigger lesson_comment_votes_guard
  before insert on public.lesson_comment_votes
  for each row execute function public.lesson_comment_votes_guard();

create or replace function public.lesson_comment_votes_sync_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.lesson_comments
      set vote_count = vote_count + 1
      where id = new.comment_id;
    return new;
  end if;

  if tg_op = 'DELETE' then
    update public.lesson_comments
      set vote_count = greatest(vote_count - 1, 0)
      where id = old.comment_id;
    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists lesson_comment_votes_sync_count on public.lesson_comment_votes;
create trigger lesson_comment_votes_sync_count
  after insert or delete on public.lesson_comment_votes
  for each row execute function public.lesson_comment_votes_sync_count();

alter table public.lesson_comments enable row level security;
alter table public.lesson_comment_votes enable row level security;

drop policy if exists "lesson_comments_select" on public.lesson_comments;
create policy "lesson_comments_select"
  on public.lesson_comments
  for select
  using (true);

drop policy if exists "lesson_comments_insert_own" on public.lesson_comments;
create policy "lesson_comments_insert_own"
  on public.lesson_comments
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "lesson_comments_delete_own" on public.lesson_comments;
create policy "lesson_comments_delete_own"
  on public.lesson_comments
  for delete
  using (auth.uid() = user_id);

drop policy if exists "lesson_comment_votes_select_own" on public.lesson_comment_votes;
create policy "lesson_comment_votes_select_own"
  on public.lesson_comment_votes
  for select
  using (auth.uid() = user_id);

drop policy if exists "lesson_comment_votes_insert_own" on public.lesson_comment_votes;
create policy "lesson_comment_votes_insert_own"
  on public.lesson_comment_votes
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "lesson_comment_votes_delete_own" on public.lesson_comment_votes;
create policy "lesson_comment_votes_delete_own"
  on public.lesson_comment_votes
  for delete
  using (auth.uid() = user_id);
