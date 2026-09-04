-- Wire public.users to Supabase Auth and let learners insert their own row.

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'users_id_auth_fkey'
  ) then
    alter table public.users
      add constraint users_id_auth_fkey
      foreign key (id) references auth.users (id) on delete cascade;
  end if;
end $$;

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own"
  on public.users
  for insert
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, new.id::text || '@anon.quality-central.local'),
    coalesce(new.raw_user_meta_data->>'display_name', 'Learner')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
