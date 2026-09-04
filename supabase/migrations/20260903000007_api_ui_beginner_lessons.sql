-- Numbered API Testing and UI Automation beginner path (sort 1–4).

insert into public.modules (slug, title, description, track, category, lesson_id, sort_order)
values
  (
    'api-testing-01-introduction-to-api-testing',
    'Introduction to API Testing',
    'Requests, responses, and why testers check APIs',
    'api',
    'api-testing',
    '01-introduction-to-api-testing',
    1
  ),
  (
    'api-testing-02-http-methods-and-status-codes',
    'HTTP Methods & Status Codes',
    'GET through DELETE, idempotency, and status oracles',
    'api',
    'api-testing',
    '02-http-methods-and-status-codes',
    2
  ),
  (
    'api-testing-03-rest-and-json',
    'REST & JSON Contracts',
    'Resources, payload shape, and contract drift',
    'api',
    'api-testing',
    '03-rest-and-json',
    3
  ),
  (
    'api-testing-04-postman-collections',
    'Postman Collections & Environments',
    'Collections, variables, Tests tab, and Newman',
    'api',
    'api-testing',
    '04-postman-collections',
    4
  ),
  (
    'ui-automation-01-introduction-to-ui-automation',
    'Introduction to UI Automation',
    'When to automate the browser and what to skip',
    'automation',
    'ui-automation',
    '01-introduction-to-ui-automation',
    1
  ),
  (
    'ui-automation-02-dom-and-locators',
    'The DOM & Stable Locators',
    'Role, name, and test ids that survive redesign',
    'automation',
    'ui-automation',
    '02-dom-and-locators',
    2
  ),
  (
    'ui-automation-03-automation-frameworks',
    'Automation Frameworks',
    'Playwright, Cypress, Selenium, and page objects',
    'automation',
    'ui-automation',
    '03-automation-frameworks',
    3
  ),
  (
    'ui-automation-04-playwright-first-test',
    'Your First Playwright Test',
    'test, expect, auto-wait, and a SAVE10 spec',
    'automation',
    'ui-automation',
    '04-playwright-first-test',
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

update public.modules set sort_order = 5 where slug = 'api-testing-rest';
update public.modules set sort_order = 6 where slug = 'api-testing-http-methods';
update public.modules set sort_order = 7 where slug = 'api-testing-postman';
update public.modules set sort_order = 5 where slug = 'ui-automation-frameworks';
update public.modules set sort_order = 6 where slug = 'ui-automation-dom';

update public.modules
set description = 'API testing track covering intro, HTTP, REST/JSON, and Postman'
where slug = 'api';

update public.modules
set description = 'UI automation track covering intro, DOM locators, frameworks, and Playwright'
where slug = 'automation';
