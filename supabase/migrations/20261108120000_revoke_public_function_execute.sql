-- Trigger helpers were exposed on the Data API, and several had a
-- role-mutable search_path. Triggers still fire without an EXECUTE grant.
-- consume_chat_quota stays callable by signed-in learners.

alter function public.set_updated_at() set search_path = public;
alter function public.lesson_comments_prepare() set search_path = public;
alter function public.lesson_comment_votes_guard() set search_path = public;
alter function public.users_protect_pro_fields() set search_path = public;
alter function public.lesson_comments_clear_hidden() set search_path = public;
alter function public.lesson_comment_reports_guard() set search_path = public;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.lesson_comments_prepare() from public, anon, authenticated;
revoke all on function public.lesson_comment_votes_guard() from public, anon, authenticated;
revoke all on function public.users_protect_pro_fields() from public, anon, authenticated;
revoke all on function public.lesson_comments_clear_hidden() from public, anon, authenticated;
revoke all on function public.lesson_comment_reports_guard() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.lesson_comment_reports_hide() from public, anon, authenticated;
revoke all on function public.lesson_comment_votes_sync_count() from public, anon, authenticated;

-- Auth creates the profile row through this trigger. Keep that role able to
-- run it if a future Postgres checks EXECUTE when the trigger fires.
grant execute on function public.handle_new_user() to supabase_auth_admin;

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke all on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end $$;
