import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { SaltongRoundPrimaryKeys } from "../types";
import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { getFormattedDateInPh } from "@/utils/time";

export default function getSaltongRound(
  client: SupabaseClient<Database>,
  params: SaltongRoundPrimaryKeys
) {
  return client.from("saltong-rounds").select().match(params).maybeSingle();
}

export const getCachedSaltongRound = cache(
  async (
    date: SaltongRoundPrimaryKeys["date"] = getFormattedDateInPh(),
    mode: SaltongRoundPrimaryKeys["mode"]
  ) => {
    const client = await createClient();
    const response = await getSaltongRound(client, {
      date,
      mode,
    });

    return response.data;
  }
);
