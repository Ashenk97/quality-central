-- Capstone track: QA sprint simulation (sort 1).

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
  check (track in ('manual', 'api', 'automation', 'technical', 'interview', 'capstone', 'sandbox'));

insert into public.modules (slug, title, description, track, category, lesson_id, sort_order)
values
  (
    'capstone',
    'Capstone',
    'QA sprint simulation: plan, hunt, API, SQL, and Playwright',
    'capstone',
    'capstone',
    null,
    0
  ),
  (
    'capstone-01-sandbox-challenge',
    'Capstone Project: The QA Sprint Simulation',
    'Four-phase Nimbus sprint — certificate on pass',
    'capstone',
    'capstone',
    '01-sandbox-challenge',
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
