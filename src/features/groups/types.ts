import { Tables } from "@/lib/supabase/types";

export type Group = Tables<"groups">;
export type GroupMember = Tables<"group_members">;
export type Profile = Tables<"profiles">;

export type GroupMemberWithProfile = {
  userId: string;
  role: "admin" | "member";
  profiles: {
    id: string;
    username: string | null;
    avatar_url: string | null;
    display_name: string | null;
  };
};
