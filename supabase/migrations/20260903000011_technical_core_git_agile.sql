-- Technical Core lesson 2: Git, GitHub, and Agile ceremonies.

insert into public.modules (slug, title, description, track, category, lesson_id, sort_order)
values
  (
    'technical-core-02-git-and-agile',
    'Git, GitHub, and Agile Ceremonies',
    'Standup, planning, Git clone/pull, and QA on pull requests',
    'technical',
    'technical-core',
    '02-git-and-agile',
    2
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
set description = 'SQL for backend checks, plus Git, GitHub, and Scrum ceremonies'
where slug = 'technical';
