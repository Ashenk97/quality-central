-- Next-Gen QA track: AI prompting and probabilistic asserts (sort 1).

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
  check (track in ('manual', 'api', 'automation', 'technical', 'interview', 'capstone', 'sandbox', 'next-gen'));

insert into public.modules (slug, title, description, track, category, lesson_id, sort_order)
values
  (
    'next-gen',
    'Next-Gen QA',
    'LLMs for fixtures and Playwright drafts, plus testing probabilistic AI',
    'next-gen',
    'next-gen',
    null,
    0
  ),
  (
    'next-gen-01-ai-in-testing',
    'AI in QA: Prompting & Test Generation',
    'Mock JSON, BVA dumps, deterministic vs probabilistic asserts',
    'next-gen',
    'next-gen',
    '01-ai-in-testing',
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
