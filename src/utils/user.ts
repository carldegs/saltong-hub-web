import { profileValidationSchema } from "@/features/profiles/schemas";
import { IdentityProviderMap } from "@/lib/supabase/provider-types";
import { JwtPayload, User } from "@supabase/supabase-js";

/**
 * @deprecated Use type from profiles table instead
 */
export interface Profile {
  username: string;
  avatarUrl: string;
  email: string;
  mainProvider: string;
  userId: string;
}

export interface MetadataProfile {
  selected_username?: string;
  selected_avatar_url?: string;
}

export const BORING_AVATAR_COLORS = [
  "#38E18C",
  "#183426",
  "#8759F3",
  "#35225F",
  "#E23B3B",
  "#5E2525",
  "#499AEE",
  "#102943",
];

/**
 * @deprecated Get profile from profiles table instead
 */
export const getProileFromIdentityData = ({
  provider,
  data,
}: IdentityProviderMap): Omit<Profile, "mainProvider" | "userId"> => {
  switch (provider) {
    case "google":
      return {
        username: data.name,
        avatarUrl: data.picture,
        email: data.email,
      };
    case "email":
      return {
        username: data.email,
        avatarUrl: "",
        email: data.email,
      };
    case "discord":
      return {
        username: data.full_name,
        avatarUrl: data.picture,
        email: data.email,
      };
    case "twitter":
      return {
        username: data.preferred_username || data.user_name,
        avatarUrl: data.picture,
        email: data.email,
      };
    case "facebook":
      return {
        username: data.nickname || data.full_name,
        avatarUrl: data.picture,
        email: data.email,
      };
  }
};

/**
 * @deprecated Get profile from profiles table instead
 */
export const getUserProfile = (user?: User | null): Profile | undefined => {
  if (!user) {
    return undefined;
  }

  const mainProvider =
    user.app_metadata?.provider ||
    user.app_metadata?.providers?.[0] ||
    "unknown";

  const mainIdentity = user.identities?.find(
    (identity) => identity.provider === mainProvider
  );

  const selectedProfile: Partial<Omit<Profile, "mainProvider" | "email">> = {
    ...(user.user_metadata?.selected_username
      ? { username: user.user_metadata.selected_username }
      : {}),
    ...(user.user_metadata?.avatar_url
      ? { avatarUrl: user.user_metadata.selected_avatar_url }
      : {}),
  };

  return {
    ...getProileFromIdentityData({
      provider: mainProvider,
      data: mainIdentity?.identity_data,
    } as IdentityProviderMap),
    ...selectedProfile,
    mainProvider,
    userId: user.id,
  };
};

export const getAvatarOptionsFromUser = (user?: User | null) => {
  if (!user) {
    return [];
  }

  return (user?.identities || [])
    .map((identity) => ({
      value: identity.identity_data?.avatar_url,
      label: identity.provider?.toUpperCase() ?? "",
    }))
    .filter(({ value }) => value);
};

export const getBoringAvatarUrl = (value: string) => {
  return `ba://${value}`;
};

export const isBoringAvatarUrl = (url = "") => {
  return url.startsWith("ba://");
};

export const getSuggestedProfileFromClaims = (claims?: JwtPayload) => {
  if (!claims) {
    return null;
  }

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
    username,
    displayName,
    avatarUrl,
    avatarOptions: [],
  };
};

export const getSuggestedProfileFromUser = (user?: User | null) => {
  if (!user) {
    return null;
  }

  const {
    name,
    user_name,
    full_name,
    preferred_username,
    selected_username,
    selected_avatar_url,
  } = user.user_metadata || {};

  const username = [
    selected_username,
    user_name,
    preferred_username,
    user.email?.split("@")[0]?.replaceAll("+", "-"),
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
    selected_avatar_url ?? (user?.email ? getBoringAvatarUrl(user.email) : "");

  return {
    username,
    displayName,
    avatarUrl,
    avatarOptions: getAvatarOptionsFromUser(user),
  };
};

export const isUserConfirmed = (user?: User | null) => {
  return user?.app_metadata?.providers?.includes("email")
    ? !!user?.confirmed_at
    : true;
};
