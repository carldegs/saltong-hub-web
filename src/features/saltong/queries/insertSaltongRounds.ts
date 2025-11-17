"use server";

import { createClient } from "@/lib/supabase/server";
import { SaltongMode } from "../types";
import { revalidatePath } from "next/cache";

export interface InsertSaltongRoundsInput {
  mode: SaltongMode;
  rounds: Array<{ date: string; word: string; roundId: number }>;
}

export async function insertSaltongRounds({
  mode,
  rounds,
}: InsertSaltongRoundsInput) {
  const client = await createClient();

  if (!rounds?.length) return { success: true };

  const payload = rounds.map((r) => ({
    date: r.date,
    word: r.word,
    mode,
    roundId: r.roundId,
    createdAt: new Date().toISOString(),
  }));

  const { error } = await client.from("saltong-rounds").insert(payload);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/${mode === "classic" ? "classic" : mode}`);
  return { success: true };
}
