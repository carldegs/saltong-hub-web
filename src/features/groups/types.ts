import { Tables } from "@/lib/supabase/types";

export type Group = Tables<"groups">;
export type GroupMember = Tables<"group_members">;
export type Profile = Tables<"profiles">;
