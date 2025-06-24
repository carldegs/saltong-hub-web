import { Tables } from "@/lib/supabase/types";
import { GAME_SETTINGS } from "../constants";

export type HexRound = Tables<"saltong-hex-rounds">;

export interface HexAnswerData {
  guessedWords: string[];
  liveScore: number;
  startedAt?: number;
  updatedAt?: number;
  isRevealed?: boolean;
  isTopRank?: boolean;

  isTopRankWhileLive?: boolean;
}

export type Rank = (typeof GAME_SETTINGS.hex.config.ranks)[number];

export type ScoredRank = Rank & { score: number };
