create table if not exists public.app_feature_flags (
  key text primary key,
  enabled boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

alter table public.app_feature_flags enable row level security;

insert into public.app_feature_flags (key, enabled, config)
values ('auto_join_saltong_solvers', false, '{}'::jsonb)
on conflict (key) do nothing;

alter table public.groups
add column if not exists "hideUnsolvedMembers" boolean not null default false;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'group_members_groupId_userId_key'
      and conrelid = 'public.group_members'::regclass
  ) then
    alter table public.group_members
    add constraint "group_members_groupId_userId_key" unique ("groupId", "userId");
  end if;
end;
$$;

create or replace function public.touch_app_feature_flags_updated_at()
returns trigger
language plpgsql
as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$;

drop trigger if exists app_feature_flags_touch_updated_at on public.app_feature_flags;

create trigger app_feature_flags_touch_updated_at
before update on public.app_feature_flags
for each row
execute function public.touch_app_feature_flags_updated_at();

create or replace function public.auto_join_saltong_solvers()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_group_id uuid;
  target_group_id_text text;
begin
  if new."isCorrect" is distinct from true then
    return new;
  end if;

  if new."userId" is null or new."userId" = 'unauthenticated' then
    return new;
  end if;

  select config ->> 'groupId'
  into target_group_id_text
  from public.app_feature_flags
  where key = 'auto_join_saltong_solvers'
    and enabled = true;

  if target_group_id_text is null
    or target_group_id_text = ''
    or target_group_id_text !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    or new."userId" !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  then
    return new;
  end if;

  target_group_id = target_group_id_text::uuid;

  if not exists (
    select 1
    from public.groups
    where id = target_group_id
  ) then
    return new;
  end if;

  insert into public.group_members ("groupId", "userId", role, "joinedAt")
  values (target_group_id, new."userId"::uuid, 'member', now())
  on conflict ("groupId", "userId") do nothing;

  return new;
end;
$$;

drop trigger if exists auto_join_saltong_solvers on public."saltong-user-rounds";

create trigger auto_join_saltong_solvers
after insert or update of "isCorrect", "userId" on public."saltong-user-rounds"
for each row
when (new."isCorrect" = true and new."userId" <> 'unauthenticated')
execute function public.auto_join_saltong_solvers();
