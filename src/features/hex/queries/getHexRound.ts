import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { HexRoundPrimaryKeys } from "../types";
import { getFormattedHexDateInPh } from "@/utils/time";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export default function getHexRound(
  client: SupabaseClient<Database>,
  params: HexRoundPrimaryKeys
) {
  return client.from("saltong-hex-rounds").select().match(params).maybeSingle();
}

export const getCachedHexRound = cache(
  async (date: HexRoundPrimaryKeys["date"] = getFormattedHexDateInPh()) => {
    const client = await createClient();
    const response = await getHexRound(client, {
      date,
    });
    return response.data;
  }
);
