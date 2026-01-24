"use client";

import { Profile } from "@/features/profiles/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ProfileAvatar from "@/app/components/profile-avatar";
import { LogOutIcon, SettingsIcon, UserCircle2Icon } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import Link from "next/link";
import NewFeatureBadge from "./new-feature-badge";
import { useSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import CompleteProfileDialog from "@/features/profiles/components/complete-profile";

export function UserDetail(
  profile: Pick<Profile, "username" | "display_name" | "avatar_url">,
  className?: string
) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-1 py-1.5 text-left text-sm",
        className
      )}
    >
      <ProfileAvatar
        path={profile.avatar_url ?? ""}
        fallback={profile.username || "?"}
        className="size-8 rounded-lg"
      />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{profile.display_name}</span>
        {profile.username && (
          <span className="truncate text-xs">@{profile.username}</span>
        )}
      </div>
    </div>
  );
}

export function NavUserDropdown({
  profile,
  isTemporaryProfile,
  avatarOptions,
  children,
  side,
}: {
  profile: Profile;
  children: React.ReactNode;
  isTemporaryProfile?: boolean;
  avatarOptions?: {
    label: string;
    value: string;
  }[];
  side?: "top" | "right" | "bottom" | "left";
}) {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={side ?? (isMobile ? "bottom" : "right")}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <UserDetail {...profile} />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {profile && !isTemporaryProfile ? (
            <DropdownMenuItem>
              <Link
                href={`/u/${profile.username}`}
                className="flex w-full items-center"
                prefetch={false}
              >
                <UserCircle2Icon className="mr-4 inline size-5" />
                View Profile
                <NewFeatureBadge />
              </Link>
            </DropdownMenuItem>
          ) : (
            <CompleteProfileDialog
              userId={profile.id}
              action="redirect"
              username={profile.username}
              avatarUrl={profile.avatar_url ?? ""}
              displayName={profile.display_name ?? ""}
              avatarOptions={avatarOptions}
            >
              <DropdownMenuItem
                className="flex w-full items-center"
                onSelect={(e) => e.preventDefault()}
              >
                <UserCircle2Icon className="mr-2 inline size-5" />
                View Profile
                <NewFeatureBadge />
              </DropdownMenuItem>
            </CompleteProfileDialog>
          )}

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
            <LogOutIcon className="mr-2 size-5" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
