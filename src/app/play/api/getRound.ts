import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";
import { getFormattedDateInPh, getFormattedHexDateInPh } from "@/utils/time";
import { cache } from "react";

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

    // eslint-disable-next-line no-console
    console.log({ gameDate, date, table, d: Date() });

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
