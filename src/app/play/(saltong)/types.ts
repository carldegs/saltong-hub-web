import { Database, Tables } from "@/lib/supabase/types";

export enum LetterStatus {
  Correct = "O",
  Partial = "~",
  Incorrect = "X",
  Empty = " ",
}

export type GameMode = "main" | "mini" | "max";

export type SaltongRound = Tables<"saltong-main-rounds">;

export interface RoundAnswerData {
  grid: string;
  answer?: string;
  updatedAt?: number;
  startedAt?: number;
  endedAt?: number;
  isCorrect?: boolean;
  solvedTurn?: number;
  solvedLive?: boolean;
}

export interface RoundStats {
  isCorrect: boolean;
  time: number;
}

export interface PlayerStats {
  numWins: number;
  numWinsLive: number;
  numLosses: number;
  winRate: number;
  winStreak: number;
  longestWinStreak: number;
}
