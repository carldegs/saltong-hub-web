"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { HexRound } from "../types";

export interface InsertHexRoundsInput {
  rounds: Array<
    Pick<
      HexRound,
      | "date"
      | "centerLetter"
      | "rootWord"
      | "wordId"
      | "words"
      | "roundId"
      | "maxScore"
      | "numWords"
      | "numPangrams"
    >
  >;
}

export async function insertHexRounds({ rounds }: InsertHexRoundsInput) {
  const client = await createClient();

  if (!rounds?.length) return { success: true };

  const payload = rounds.map((r) => ({
    date: r.date,
    centerLetter: r.centerLetter,
    rootWord: r.rootWord,
    wordId: r.wordId,
    words: r.words,
    roundId: r.roundId,
    maxScore: r.maxScore,
    numWords: r.numWords,
    numPangrams: r.numPangrams,
    createdAt: new Date().toISOString(),
  }));

  const { error } = await client.from("saltong-hex-rounds").insert(payload);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/hex");
  return { success: true };
}
