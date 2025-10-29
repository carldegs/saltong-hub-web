import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { SaltongUserRoundPrimaryKeys } from "../types";
import { cache } from "react";
import { getFormattedDateInPh } from "@/utils/time";
import { createClient } from "@/lib/supabase/server";

export default function getSaltongUserRound(
  client: SupabaseClient<Database>,
  params: SaltongUserRoundPrimaryKeys
) {
  return client
    .from("saltong-user-rounds")
    .select()
    .match(params)
    .maybeSingle();
}

export const getCachedSaltongUserRound = cache(
  async (
    date: SaltongUserRoundPrimaryKeys["date"] = getFormattedDateInPh(),
    mode: SaltongUserRoundPrimaryKeys["mode"],
    userId?: SaltongUserRoundPrimaryKeys["userId"]
  ) => {
    if (!userId) {
      return;
    }

    const client = await createClient();

    return await getSaltongUserRound(client, {
      userId,
      date,
      mode,
    });
  }
);
