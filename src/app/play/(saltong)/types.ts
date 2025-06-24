import { Tables } from "@/lib/supabase/types";
import { GameId } from "../types";

export enum LetterStatus {
  Correct = "O",
  Partial = "~",
  Incorrect = "X",
  Empty = " ",
}

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
  status: "correct" | "incorrect" | "partial" | "idle";
  round: RoundAnswerData;
  timeSolvedInSec?: number;
}

export interface PlayerStats {
  gameId: GameId;
  totalWins: number;
  totalLosses: number;
  currentWinStreak: number;
  longestWinStreak: number;
  winTurns: number[];
  lastGameDate: string;
  lastGameId: number;

  createdAt: number;
  updatedAt: number;
}
