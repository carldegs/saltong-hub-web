import { Tables } from "@/lib/supabase/types";

export enum LetterStatus {
  Correct = "O",
  Partial = "~",
  Incorrect = "X",
  Empty = " ",
}

export type GameMode = "main" | "mini" | "max";

export interface GameConfig {
  maxTries: number;
  wordLen: number;
  subtitle: string;
  colorScheme: string;
  mode: GameMode;
  tableName: `saltong-${GameMode}-rounds`;
  icon: string;
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
  time: number;
}

export interface PlayerStats {
  gameMode: GameMode;
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
