-- Seed Sandbox defects as modules for progress tracking.

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
  check (track in ('manual', 'api', 'automation', 'sandbox'));

insert into public.modules (slug, title, description, track, category, lesson_id, sort_order)
values
  (
    'sandbox-visual-overlap',
    'Submit overlaps CVC',
    'On viewports below 768px the Submit button covers the CVC field',
    'sandbox',
    'sandbox',
    'visual-overlap',
    1
  ),
  (
    'sandbox-validation-bypass',
    'Email validation bypass',
    'Email is required only via HTML; empty email can still submit',
    'sandbox',
    'sandbox',
    'validation-bypass',
    2
  ),
  (
    'sandbox-discount-stacking',
    'Discount stacking',
    'SAVE20 subtracts 20% of the original subtotal on every apply',
    'sandbox',
    'sandbox',
    'discount-stacking',
    3
  )
on conflict (slug) do nothing;
