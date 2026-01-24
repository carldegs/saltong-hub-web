import { JwtPayload } from "@supabase/supabase-js";
import { Profile } from "./types";
import { getBoringAvatarUrl } from "@/utils/user";
import { profileValidationSchema } from "./schemas";

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
