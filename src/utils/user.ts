import { IdentityProviderMap } from "@/lib/supabase/provider-types";
import { User } from "@supabase/supabase-js";

export interface Profile {
  username: string;
  avatarUrl: string;
  email: string;
  mainProvider: string;
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

export const getProileFromIdentityData = ({
  provider,
  data,
}: IdentityProviderMap): Omit<Profile, "mainProvider"> => {
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
  };
};

export const isUserConfirmed = (user?: User | null) => {
  return user?.app_metadata?.providers?.includes("email")
    ? !!user?.confirmed_at
    : true;
};
