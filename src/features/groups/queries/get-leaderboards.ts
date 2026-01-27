import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export interface GetLeaderboardsParams {
  groupId: string;
  mode: string;
  date: string;
}

export function getLeaderboards(
  client: SupabaseClient<Database>,
  params: GetLeaderboardsParams
) {
  return client.rpc("get_group_members_rounds", {
    p_group: params.groupId,
    p_mode: params.mode,
    p_date: params.date,
  });
}

export const getCachedLeaderboards = cache(
  async (params: GetLeaderboardsParams) => {
    const client = await createClient();

    return await getLeaderboards(client, params);
  }
);
