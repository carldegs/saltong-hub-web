import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { HexUserRoundPrimaryKeys } from "../types";
import { cache } from "react";
import { getFormattedDateInPh } from "@/utils/time";
import { createClient } from "@/lib/supabase/server";

export default function getHexUserRound(
  client: SupabaseClient<Database>,
  params: HexUserRoundPrimaryKeys
) {
  return client
    .from("saltong-hex-user-rounds")
    .select()
    .match(params)
    .maybeSingle();
}

export const getCachedHexUserRound = cache(
  async (
    date: HexUserRoundPrimaryKeys["date"] = getFormattedDateInPh(),
    userId?: HexUserRoundPrimaryKeys["userId"]
  ) => {
    if (!userId) {
      return;
    }

    const client = await createClient();

    return await getHexUserRound(client, {
      userId,
      date,
    });
  }
);
