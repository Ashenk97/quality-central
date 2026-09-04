-- Allow learners to wipe their own progress and badges (dashboard reset).

drop policy if exists "progress_delete_own" on public.user_progress;
create policy "progress_delete_own"
  on public.user_progress
  for delete
  using (auth.uid() = user_id);

drop policy if exists "user_badges_delete_own" on public.user_badges;
create policy "user_badges_delete_own"
  on public.user_badges
  for delete
  using (auth.uid() = user_id);
