import { SaltongMode, SaltongUserStats } from "@/features/saltong/types";

export type AdminUserStatsResponse = {
  user: {
    id: string;
    email: string;
    createdAt: string | null;
  };
  stats: Record<SaltongMode, SaltongUserStats | null>;
};

export interface AdminPersistedStatsRow {
  mode: SaltongMode;
  totalWins: number;
  totalLosses: number;
  currentWinStreak: number;
  longestWinStreak: number;
  lastGameDate: string | null;
  lastRoundId: number | null;
  winTurns: number[];
}

export interface AdminUpsertStatsRequest {
  userId: string;
  rows: AdminPersistedStatsRow[];
}

export type AdminUpsertStatsResponse = AdminUserStatsResponse;

export interface LegacyModeStatsSnapshot {
  gamesPlayed: number;
  totalWins: number;
  currentWinStreak: number;
  longestWinStreak: number;
  lastWinDate: string | null;
  winTurns: number[];
}

export interface LegacySavePayload {
  modes: Record<SaltongMode, LegacyModeStatsSnapshot | null>;
  decodedString: string;
}
