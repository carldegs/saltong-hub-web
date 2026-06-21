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
