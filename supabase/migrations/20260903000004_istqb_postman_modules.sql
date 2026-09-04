-- ISTQB + Postman modules and foundation sort order.

insert into public.modules (slug, title, description, track, category, lesson_id, sort_order)
values
  (
    'foundation-istqb',
    'ISTQB Foundation',
    'ISTQB principles, test levels, and the language of QA',
    'manual',
    'foundation',
    'istqb',
    1
  ),
  (
    'api-testing-postman',
    'Postman',
    'Collections, environments, and automated API checks',
    'api',
    'api-testing',
    'postman',
    3
  )
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  track = excluded.track,
  category = excluded.category,
  lesson_id = excluded.lesson_id,
  sort_order = excluded.sort_order;

update public.modules
set
  sort_order = 4,
  description = 'Test design, exploratory testing, and defect reporting'
where slug = 'foundation-manual-qa';

update public.modules
set description = 'Foundation track covering ISTQB, SDLC, STLC, and Manual QA'
where slug = 'manual';

update public.modules
set description = 'API testing track covering REST, HTTP methods, and Postman'
where slug = 'api';
