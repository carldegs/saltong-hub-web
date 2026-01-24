import { getProfileFormData } from "@/features/profiles/utils";
import LoginSidebarMenu from "./app-sidebar.ts/nav-user/login-sidebar-menu";
import { createClient } from "@/lib/supabase/server";
import { NavUserDropdown } from "./nav-user-dropdown";
import ProfileAvatar from "@/app/components/profile-avatar";

export default async function NavbarUser() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (!claimsData?.claims || claimsError) {
    return (
      <LoginSidebarMenu className="h-9 w-auto gap-1.5 px-2.5 font-bold md:px-4" />
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
    <NavUserDropdown
      profile={profile}
      isTemporaryProfile={isTemporaryProfile}
      avatarOptions={avatarOptions}
      side="bottom"
    >
      <ProfileAvatar
        path={profile.avatar_url ?? ""}
        fallback={profile.username || "?"}
        className="size-9 cursor-pointer rounded-lg"
      />
    </NavUserDropdown>
  );
}
