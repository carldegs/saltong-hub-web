import { JwtPayload, UserIdentity } from "@supabase/supabase-js";
import { Profile } from "./types";
import { getBoringAvatarUrl } from "@/utils/user";
import { profileValidationSchema } from "./schemas";
import { DbClient } from "@/lib/supabase/client-type";
import { getCachedProfileById } from "./queries/get-profile";

export function getTemporaryProfileFromClaims(claims: JwtPayload): Profile {
  const {
    name,
    user_name,
    full_name,
    preferred_username,
    selected_username,
    selected_avatar_url,
  } = claims.user_metadata || {};

  const username = [
    selected_username,
    user_name,
    preferred_username,
    claims.email?.split("@")[0]?.replaceAll("+", "-"),
  ].find(
    (uname) =>
      !!uname && profileValidationSchema.shape.username.safeParse(uname).success
  );

  const displayName = [name, full_name, username].find(
    (dname) =>
      !!dname &&
      profileValidationSchema.shape.display_name.safeParse(dname).success
  );

  const avatarUrl =
    selected_avatar_url ??
    (claims.email ? getBoringAvatarUrl(claims.email) : "");

  return {
    avatar_url: avatarUrl,
    display_name: displayName,
    id: claims.sub,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    username,
  };
}

export function getAvatarOptionsFromIdentities(identities: UserIdentity[]) {
  return identities
    .map((identity) => ({
      value: identity.identity_data?.avatar_url,
      label: identity.provider?.toUpperCase() ?? "",
    }))
    .filter(({ value }) => value);
}

export async function getProfileFormData(
  client: DbClient,
  claims?: JwtPayload,
  onlyFetchIdentiesDataOnTemporaryProfile = false
) {
  if (!claims) {
    return null;
  }

  const { data: profileData } = await getCachedProfileById(claims.sub);
  const isTemporaryProfile = !profileData;
  const profile = profileData ?? getTemporaryProfileFromClaims(claims);

  if (isTemporaryProfile && onlyFetchIdentiesDataOnTemporaryProfile) {
    return {
      profile,
      isTemporaryProfile,
      avatarOptions: [],
      identitiesData: null,
    };
  }

  const { data: identitiesData } = await client.auth.getUserIdentities();

  const avatarOptions = getAvatarOptionsFromIdentities(
    identitiesData?.identities || []
  );

  return {
    profile,
    isTemporaryProfile,
    avatarOptions,
    identitiesData,
  };
}
