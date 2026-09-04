-- Numbered UI path: DOM, first Playwright spec, Page Object Model.

insert into public.modules (slug, title, description, track, category, lesson_id, sort_order)
values
  (
    'ui-automation-01-dom-and-locators',
    'DOM and Locators',
    'DOM render, id/CSS/XPath vs roles, brittle vs resilient',
    'automation',
    'ui-automation',
    '01-dom-and-locators',
    1
  ),
  (
    'ui-automation-02-first-playwright-test',
    'Your First Playwright Test',
    'AAA, goto/fill/click, and auto-waiting expect',
    'automation',
    'ui-automation',
    '02-first-playwright-test',
    2
  ),
  (
    'ui-automation-03-page-object-model',
    'The Page Object Model (POM)',
    'LoginPage class, specs keep assertions, no duplicated locators',
    'automation',
    'ui-automation',
    '03-page-object-model',
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

update public.modules set sort_order = 4 where slug = 'ui-automation-01-introduction-to-ui-automation';
update public.modules set sort_order = 5 where slug = 'ui-automation-03-automation-frameworks';
update public.modules set sort_order = 6 where slug = 'ui-automation-04-playwright-first-test';
update public.modules set sort_order = 7 where slug = 'ui-automation-02-dom-and-locators';
update public.modules set sort_order = 8 where slug = 'ui-automation-frameworks';
update public.modules set sort_order = 9 where slug = 'ui-automation-dom';
