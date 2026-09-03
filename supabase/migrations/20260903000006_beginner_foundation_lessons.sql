-- Zero-knowledge Foundation path first:
-- intro, test design, bug life cycle, agile (1–4),
-- then ISTQB, SDLC, STLC, Manual QA (5–8).

insert into public.modules (slug, title, description, track, category, lesson_id, sort_order)
values
  (
    'foundation-01-introduction-to-qa',
    'Introduction to QA',
    'What quality assurance is and what testers actually do',
    'manual',
    'foundation',
    '01-introduction-to-qa',
    1
  ),
  (
    'foundation-02-test-design-techniques',
    'Test design techniques',
    'Equivalence, boundaries, and choosing what to test',
    'manual',
    'foundation',
    '02-test-design-techniques',
    2
  ),
  (
    'foundation-03-bug-life-cycle',
    'Bug life cycle',
    'How a defect moves from found to closed',
    'manual',
    'foundation',
    '03-bug-life-cycle',
    3
  ),
  (
    'foundation-04-agile-and-scrum-qa',
    'Agile and Scrum QA',
    'Where testers sit in a sprint and how to start Foundation',
    'manual',
    'foundation',
    '04-agile-and-scrum-qa',
    4
  )
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  track = excluded.track,
  category = excluded.category,
  lesson_id = excluded.lesson_id,
  sort_order = excluded.sort_order;

update public.modules set sort_order = 5 where slug = 'foundation-istqb';
update public.modules set sort_order = 6 where slug = 'foundation-sdlc';
update public.modules set sort_order = 7 where slug = 'foundation-stlc';
update public.modules set sort_order = 8 where slug = 'foundation-manual-qa';

update public.modules
set description = 'Foundation track covering intro to QA, test design, bugs, agile, ISTQB, SDLC, STLC, and Manual QA'
where slug = 'manual';
