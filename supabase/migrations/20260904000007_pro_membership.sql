-- Hidden Pro tier: membership flag + Stripe customer id.

alter table public.users
  add column if not exists is_pro_member boolean not null default false,
  add column if not exists stripe_customer_id text;

create unique index if not exists users_stripe_customer_id_uidx
  on public.users (stripe_customer_id)
  where stripe_customer_id is not null;

create or replace function public.users_protect_pro_fields()
returns trigger
language plpgsql
as $$
begin
  if current_setting('role', true) = 'service_role' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.is_pro_member := false;
    return new;
  end if;

  if new.is_pro_member is distinct from old.is_pro_member then
    new.is_pro_member := old.is_pro_member;
  end if;

  -- The signed-in member may attach a customer id once (Checkout).
  if old.stripe_customer_id is not null
     and new.stripe_customer_id is distinct from old.stripe_customer_id then
    new.stripe_customer_id := old.stripe_customer_id;
  end if;

  return new;
end;
$$;

drop trigger if exists users_protect_pro_fields on public.users;
create trigger users_protect_pro_fields
  before insert or update on public.users
  for each row execute function public.users_protect_pro_fields();
