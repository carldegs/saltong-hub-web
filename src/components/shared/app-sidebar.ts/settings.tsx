import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Settings, BookOpen, Info, User, Shield } from "lucide-react";
import NewFeatureBadge from "../new-feature-badge";
import { getCachedProfileById } from "@/features/profiles/queries/get-profile";
import { Profile } from "@/features/profiles/types";
import CompleteProfileDialog from "@/features/profiles/components/complete-profile";
import { getSuggestedProfileFromUser } from "@/utils/user";

export async function SettingsSidebarMenu() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  let profile: Profile | null = null;

  if (data?.user) {
    const profileResult = await getCachedProfileById(data.user.id);
    profile = profileResult?.data;
  }

  // Check if user is an admin
  const allowedAdmins =
    process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || [];
  const isAdmin = data?.user && allowedAdmins.includes(data.user.id);

  return (
    <SidebarMenu>
      {data?.user && (
        <SidebarMenuItem>
          <SidebarMenuButton className="h-auto py-1.5" asChild>
            {profile ? (
              <Link
                href={`/u/${profile.username}`}
                className="flex w-full items-center gap-3"
              >
                <User className="h-4 w-4" />
                <span className="flex items-center">
                  <span className="text-sm">Profile</span>
                  <NewFeatureBadge />
                </span>
              </Link>
            ) : (
              <CompleteProfileDialog
                userId={data.user.id}
                action="redirect"
                {...getSuggestedProfileFromUser(data.user)}
              >
                <a className="flex w-full cursor-pointer items-center gap-3 px-2 py-1.5">
                  <User className="h-4 w-4" />
                  <span className="flex items-center">
                    <span className="text-sm">Profile</span>
                    <NewFeatureBadge />
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
            href="/blog"
            className="flex w-full items-center gap-3"
            prefetch={false}
          >
            <BookOpen className="h-4 w-4" />
            <span className="text-sm">Blog</span>
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
