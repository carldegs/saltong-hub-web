import { Tables } from "@/lib/supabase/types";

export type SaltongMode = "classic" | "max" | "mini";
export type SaltongRound = Tables<"saltong-rounds">;

export type SaltongRoundPrimaryKeys = Pick<SaltongRound, "mode" | "date">;

export type SaltongUserRound = Tables<"saltong-user-rounds">;

export type SaltongUserRoundPrimaryKeys = Pick<
  SaltongUserRound,
  "userId" | "mode" | "date"
>;

export type SaltongUserStats = Tables<"saltong-user-stats">;

export type SaltongUserStatsPrimaryKeys = Pick<
  SaltongUserStats,
  "userId" | "mode"
>;

export interface SaltongVaultRoundsParams {
  userId: string;
  mode: string;
  startDate: string;
  endDate: string;
}

export type SaltongVaultRound = Pick<
  SaltongUserRound,
  "date" | "isCorrect" | "endedAt"
>;

export enum LetterStatus {
  Correct = "O",
  Partial = "~",
  Incorrect = "X",
  Empty = " ",
}
export type SaltongUserRoundStatus =
  | "correct"
  | "incorrect"
  | "partial"
  | "idle";

export interface DetailedSaltongUserRound extends SaltongUserRound {
  isCorrect: boolean;
  status: SaltongUserRoundStatus;
  timeSolvedInSec?: number;
}

export interface SaltongHowToPlayExample {
  word: string;
  description: string;
  statuses: LetterStatus[];
}

export interface SaltongAdditionalConfig {
  startDate: string;
  maxTries: number;
  wordLen: number;
  howToPlayExamples: SaltongHowToPlayExample[];
}

/**
 * Word difficulty score returned by AI
 * Score scale: 0 = English (not Filipino/Tagalog), 1 = very common, 2 = common,
 * 3 = moderately common, 4 = regional/specialized, 5 = very obscure
 */
export interface WordScore {
  word: string;
  score: number;
  explanation: string;
}

export interface DraftRound {
  date: string;
  word: string;
  roundId: number;
  score?: number;
  explanation?: string;
}

export interface RecentRound {
  date: string;
  word: string;
  roundId: number;
}
