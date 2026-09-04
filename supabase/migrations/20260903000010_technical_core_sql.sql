-- Technical Core track: SQL for QA (sort 1).

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'modules_track_check'
  ) then
    alter table public.modules drop constraint modules_track_check;
  end if;
end $$;

alter table public.modules
  add constraint modules_track_check
  check (track in ('manual', 'api', 'automation', 'technical', 'sandbox'));

insert into public.modules (slug, title, description, track, category, lesson_id, sort_order)
values
  (
    'technical',
    'Technical Core',
    'SQL and backend checks so UI success is proven in the database',
    'technical',
    'technical-core',
    null,
    0
  ),
  (
    'technical-core-01-sql-for-qa',
    'SQL Basics: Verifying Backend Data',
    'SELECT, WHERE, ORDER BY, and INNER JOIN on users and orders',
    'technical',
    'technical-core',
    '01-sql-for-qa',
    1
  )
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  track = excluded.track,
  category = excluded.category,
  lesson_id = excluded.lesson_id,
  sort_order = excluded.sort_order;
