-- Daily Mock Interviewer quota per learner, and a size cap on mock endpoint bodies.

create table if not exists public.chat_usage (
  user_id uuid not null references public.users (id) on delete cascade,
  usage_date date not null,
  request_count integer not null default 0 check (request_count >= 0),
  primary key (user_id, usage_date)
);

alter table public.chat_usage enable row level security;

drop policy if exists "chat_usage_select_own" on public.chat_usage;
create policy "chat_usage_select_own"
  on public.chat_usage
  for select
  using (auth.uid() = user_id);

-- The limit lives here, not in a parameter, so learners cannot raise it by
-- calling the function directly with the anon key.
create or replace function public.consume_chat_quota()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  daily_limit constant integer := 30;
  uid uuid := auth.uid();
  used integer;
begin
  if uid is null then
    return false;
  end if;

  insert into public.chat_usage as usage (user_id, usage_date, request_count)
  values (uid, (now() at time zone 'utc')::date, 1)
  on conflict (user_id, usage_date)
  do update set request_count = usage.request_count + 1
  where usage.request_count < daily_limit
  returning request_count into used;

  return used is not null;
end;
$$;

revoke all on function public.consume_chat_quota() from public, anon;
grant execute on function public.consume_chat_quota() to authenticated;

alter table public.mock_endpoints
  drop constraint if exists mock_endpoints_response_body_size;

-- NOT VALID leaves existing rows alone and enforces the cap on new writes.
alter table public.mock_endpoints
  add constraint mock_endpoints_response_body_size
  check (octet_length(response_body::text) <= 10240) not valid;
