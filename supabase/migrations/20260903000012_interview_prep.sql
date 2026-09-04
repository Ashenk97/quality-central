-- Interview Prep track: intern interview lesson (sort 1).

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
  check (track in ('manual', 'api', 'automation', 'technical', 'interview', 'sandbox'));

insert into public.modules (slug, title, description, track, category, lesson_id, sort_order)
values
  (
    'interview',
    'Interview Prep',
    'Whiteboard object testing, conflict with developers, and screening vocabulary',
    'interview',
    'interview-prep',
    null,
    0
  ),
  (
    'interview-prep-01-cracking-the-qa-interview',
    'Cracking the QA Intern Interview',
    'Object testing, rejected bugs, and smoke vs sanity pairs',
    'interview',
    'interview-prep',
    '01-cracking-the-qa-interview',
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
