import { useSupabaseClient } from "@/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { insertProfile } from "../queries/insert-profile";
import { Profile } from "../types";
import { upsertProfile } from "../queries/upsert-profile";

export function useInsertProfileMutation() {
  const supabase = useSupabaseClient();

  return useMutation({
    mutationFn: async (params: Omit<Profile, "created_at" | "updated_at">) => {
      const { data, error } = await insertProfile(supabase, params);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
}

export function useUpdateProfileMutation() {
  const supabase = useSupabaseClient();

  return useMutation({
    mutationFn: async (
      params: Partial<Omit<Profile, "created_at" | "updated_at">>
    ) => {
      const { data, error } = await upsertProfile(supabase, params as Profile);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
}
