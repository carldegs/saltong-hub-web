interface BaseIdentityData {
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
  sub: string;
}

interface ProfileIdentityData extends BaseIdentityData {
  avatar_url: string;
  full_name: string;
  name: string;
  iss: string;
  picture: string;
  provider_id: string;
}

export type GoogleIdentityData = ProfileIdentityData;

export type EmailIdentityData = BaseIdentityData;

export interface DiscordIdentityData extends ProfileIdentityData {
  custom_claims: {
    global_name: string;
  };
}

export interface TwitterIdentityData extends ProfileIdentityData {
  preferred_username: string;
  user_name: string;
}

export interface FacebookIdentityData extends ProfileIdentityData {
  nickname: string;
  slug: string;
}

export type ProviderType =
  | "google"
  | "email"
  | "discord"
  | "twitter"
  | "facebook";

export type IdentityProviderMap =
  | {
      provider: "google";
      data: GoogleIdentityData;
    }
  | {
      provider: "email";
      data: EmailIdentityData;
    }
  | {
      provider: "discord";
      data: DiscordIdentityData;
    }
  | {
      provider: "twitter";
      data: TwitterIdentityData;
    }
  | {
      provider: "facebook";
      data: FacebookIdentityData;
    };

export interface UserMetadata
  extends GoogleIdentityData,
    EmailIdentityData,
    DiscordIdentityData,
    TwitterIdentityData,
    FacebookIdentityData {
  selected_username?: string;
  selected_avatar_url?: string;
}
