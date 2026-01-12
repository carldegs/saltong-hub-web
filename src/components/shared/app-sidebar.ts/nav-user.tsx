"use client";

import {
  ChevronsUpDown,
  LogOut,
  SettingsIcon,
  UserCircle2Icon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSupabaseClient } from "@/lib/supabase/client";
import { Profile } from "@/utils/user";
import { sendEvent } from "@/lib/analytics";
import ProfileAvatar from "@/app/components/profile-avatar";
import NewFeatureBadge from "../new-feature-badge";

export function NavUser({ profile }: { profile?: Profile }) {
  const supabase = useSupabaseClient();
  const { isMobile, setOpenMobile } = useSidebar();
  const currPathname = usePathname();
  const router = useRouter();

  if (!profile?.email && !profile?.username && !profile?.avatarUrl) {
    // show Log in/Sign up button
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              setOpenMobile(false);
            }}
            asChild
          >
            <Link
              href={{
                pathname: "/auth",
                query: { next: currPathname },
              }}
              onClick={() => {
                sendEvent("button_click", {
                  location: "sidebar",
                  action: "login",
                });
              }}
              prefetch={false}
            >
              Log in
            </Link>
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <ProfileAvatar
                path={profile.avatarUrl}
                fallback={profile.email || "?"}
                className="size-8 rounded-lg"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {profile.username ?? profile.email}
                </span>
                {profile.username && (
                  <span className="truncate text-xs">{profile.email}</span>
                )}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <ProfileAvatar
                  path={profile.avatarUrl}
                  fallback={profile.email || "?"}
                  className="size-10 rounded-lg"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {profile.username}
                  </span>
                  <span className="truncate text-xs">{profile.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  href={`/u/${profile.userId}`}
                  className="flex w-full items-center"
                  prefetch={false}
                >
                  <UserCircle2Icon className="mr-4 inline size-5" />
                  View Profile
                  <NewFeatureBadge />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="w-full" prefetch={false}>
                  <SettingsIcon className="mr-4 inline size-5" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                }}
              >
                <LogOut className="mr-4 size-5" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
