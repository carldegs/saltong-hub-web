import { createClient } from "@/lib/supabase/server";
import LoginSidebarMenu from "./login-sidebar-menu";
import { getProfileFormData } from "@/features/profiles/utils";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUserDropdown, UserDetail } from "../../nav-user-dropdown";
import { ChevronsUpDown } from "lucide-react";
import CompleteProfileSessionPrompt from "@/features/profiles/components/complete-profile-session-prompt";

export default async function NavUser() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (!claimsData?.claims || claimsError) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <LoginSidebarMenu className="w-full" />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const profileFormData = await getProfileFormData(
    supabase,
    claimsData?.claims
  );

  if (!profileFormData) {
    console.error("Failed to fetch profile data");
    return null;
  }

  const { profile, isTemporaryProfile, avatarOptions } = profileFormData ?? {};

  return (
    <>
      {isTemporaryProfile && (
        <CompleteProfileSessionPrompt
          userId={profile.id}
          username={profile.username}
          avatarUrl={profile.avatar_url ?? ""}
          displayName={profile.display_name ?? ""}
          avatarOptions={avatarOptions}
        />
      )}
      <SidebarMenu>
        <SidebarMenuItem>
          <NavUserDropdown
            profile={profile}
            isTemporaryProfile={isTemporaryProfile}
            avatarOptions={avatarOptions}
          >
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserDetail {...profile} />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </NavUserDropdown>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
