-- Foundation numbered path: writing test cases as sort 5.

insert into public.modules (slug, title, description, track, category, lesson_id, sort_order)
values
  (
    'foundation-05-writing-test-cases',
    'Writing Real-World Test Cases',
    'Anatomy, positive vs negative vs edge, Forgot Password suite',
    'manual',
    'foundation',
    '05-writing-test-cases',
    5
  )
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  track = excluded.track,
  category = excluded.category,
  lesson_id = excluded.lesson_id,
  sort_order = excluded.sort_order;

update public.modules set sort_order = 6 where slug = 'foundation-istqb';
update public.modules set sort_order = 7 where slug = 'foundation-sdlc';
update public.modules set sort_order = 8 where slug = 'foundation-stlc';
update public.modules set sort_order = 9 where slug = 'foundation-manual-qa';
