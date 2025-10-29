import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";
import { getFormattedDateInPh, getFormattedHexDateInPh } from "@/utils/time";
import { cache } from "react";

/**
 * @deprecated
 */
const getRound = cache(
  async <T extends keyof Database["public"]["Tables"]>(
    table: T,
    gameDate?: string
  ) => {
    const date =
      gameDate ??
      (table === "saltong-hex-rounds"
        ? getFormattedHexDateInPh()
        : getFormattedDateInPh());

    const supabase = await createClient();
    const { data: round } = await supabase
      .from(table)
      .select()
      .match({
        date,
      })
      .maybeSingle();

    return round;
  }
);

export default getRound;
