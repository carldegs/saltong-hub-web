import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Settings, BookOpen, Info, User, Shield } from "lucide-react";
import CompleteProfileDialog from "@/features/profiles/components/complete-profile";
import { getProfileFormData } from "@/features/profiles/utils";

export async function SettingsSidebarMenu() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  const userId = data?.claims?.sub;

  const { profile, isTemporaryProfile, avatarOptions } =
    (await getProfileFormData(supabase, data?.claims)) ?? {};

  // Check if user is an admin
  const allowedAdmins =
    process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || [];
  const isAdmin = userId && allowedAdmins.includes(userId);

  return (
    <SidebarMenu>
      {!!userId && (
        <SidebarMenuItem>
          <SidebarMenuButton className="h-auto py-1.5" asChild>
            {profile && !isTemporaryProfile ? (
              <Link
                href={`/u/${profile.username}`}
                className="flex w-full items-center gap-3"
              >
                <User className="h-4 w-4" />
                <span className="flex items-center">
                  <span className="text-sm">Profile</span>
                </span>
              </Link>
            ) : (
              <CompleteProfileDialog
                userId={userId}
                action="redirect"
                username={profile?.username}
                avatarUrl={profile?.avatar_url ?? ""}
                displayName={profile?.display_name ?? ""}
                avatarOptions={avatarOptions}
              >
                <a className="flex w-full cursor-pointer items-center gap-3 px-2 py-1.5">
                  <User className="h-4 w-4" />
                  <span className="flex items-center">
                    <span className="text-sm">Profile</span>
                  </span>{" "}
                </a>
              </CompleteProfileDialog>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}

      <SidebarMenuItem>
        <SidebarMenuButton className="h-auto py-1.5" asChild>
          <Link
            href="/settings"
            className="flex w-full items-center gap-3"
            prefetch={false}
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm">Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton className="h-auto py-1.5" asChild>
          <Link
            href="/patch-notes"
            className="flex w-full items-center gap-3"
            prefetch={false}
          >
            <BookOpen className="h-4 w-4" />
            <span className="text-sm">Patch Notes</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton className="h-auto py-1.5" asChild>
          <Link
            href="/about"
            className="flex w-full items-center gap-3"
            prefetch={false}
          >
            <Info className="h-4 w-4" />
            <span className="text-sm">About</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {isAdmin && (
        <SidebarMenuItem>
          <SidebarMenuButton className="h-auto py-1.5" asChild>
            <Link
              href="/admin"
              className="flex w-full items-center gap-3"
              prefetch={false}
            >
              <Shield className="h-4 w-4" />
              <span className="text-sm">Admin</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
