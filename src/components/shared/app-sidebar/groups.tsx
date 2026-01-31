import ProfileAvatar from "@/app/components/profile-avatar";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getRecentUserGroups } from "@/features/groups/queries/get-group";
import { createClient } from "@/lib/supabase/server";
import { ChevronRightIcon, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import NewFeatureBadge from "../new-feature-badge";

export async function GroupsSidebarMenu() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  const recentGroups = await getRecentUserGroups(supabase, data.claims.sub);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        GROUPS <NewFeatureBadge />
      </SidebarGroupLabel>
      <SidebarGroupAction
        className="mr-4 text-sm whitespace-nowrap hover:underline"
        asChild
      >
        <Link href="/groups" prefetch={false}>
          <span>See All</span>
          <ChevronRightIcon />
        </Link>
      </SidebarGroupAction>
      <SidebarMenu className="gap-0">
        {recentGroups.map(({ avatarUrl, id, name }) => (
          <SidebarMenuItem key={id}>
            <SidebarMenuButton className="h-auto py-1.5" asChild>
              <Link
                href={`/groups/${id}`}
                className="flex w-full items-center gap-3"
                prefetch={false}
              >
                <ProfileAvatar
                  path={avatarUrl ?? ""}
                  fallback={name}
                  profileType="group"
                  className="size-4"
                />
                <span className="text-sm">{name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="h-auto py-1.5" asChild>
            <Link
              href="/groups/create"
              className="flex w-full items-center gap-3"
              prefetch={false}
            >
              <PlusCircleIcon className="h-4 w-4" />
              Create Group
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
