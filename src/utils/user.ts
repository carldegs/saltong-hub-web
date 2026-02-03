import { IdentityProviderMap } from "@/lib/supabase/provider-types";
import { User } from "@supabase/supabase-js";

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

export const BORING_AVATAR_GROUP_COLORS = [
  "#38E18C",
  "#8759F3",
  "#E23B3B",
  "#499AEE",
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

export const isUserConfirmed = (user?: User | null) => {
  return user?.app_metadata?.providers?.includes("email")
    ? !!user?.confirmed_at
    : true;
};
