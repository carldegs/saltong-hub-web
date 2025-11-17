import { Tables } from "@/lib/supabase/types";

export type HexRound = Tables<"saltong-hex-rounds">;

export type HexRoundPrimaryKeys = Pick<HexRound, "date">;

export type HexUserRound = Tables<"saltong-hex-user-rounds">;

export type TransformedHexUserRound = Omit<HexUserRound, "guessedWords"> & {
  guessedWords: string[];
};

export type HexUserRoundPrimaryKeys = Pick<HexUserRound, "userId" | "date">;

export interface HexRank {
  name: string;
  percentage: number;
  icon: string;
}

export type ScoredHexRank = HexRank & { score: number };

export interface HexAdditionalConfig {
  startDate: string;
  ranks: HexRank[];
  numWordsLimit: number;
  minPangramLetters: number;
  maxPangramLetters: number;
  minWordListLetters: number;
  maxWordListLetters: number;
}

// Vault rounds typings
export interface HexVaultRoundsParams {
  userId: string; // "unauthenticated" for guests
  startDate: string; // inclusive YYYY-MM-DD
  endDate: string; // inclusive YYYY-MM-DD
}

export type HexVaultRound = Pick<
  HexUserRound,
  "date" | "liveScore" | "updatedAt" | "isRevealed" | "isTopRank"
> & {
  // Normalize guessedWords to an array for consumers like the vault calendar
  guessedWords: string[];
};

// LocalStorage stored hex user rounds (similar to Saltong)
export type HexStoredUserRound = Pick<
  HexUserRound,
  "userId" | "date" | "liveScore" | "updatedAt" | "isRevealed" | "isTopRank"
> & {
  guessedWords: string[]; // Already parsed in localStorage
};

// Lookup table types
export interface HexWordBankItem {
  word: string;
  wordMask: number;
  isPangram: boolean;
}

export interface HexLookupTableItem {
  wordId: number;
  centerLetter: string;
  numWords: number;
  numPangrams: number;
  rootWord: string; // representative pangram if any
  numLetters: number; // number of letters in the charset
}

export interface HexLookupTableMetadata {
  status: "generating" | "completed" | "error";
  startedAt: string;
  completedAt?: string;
  lastUpdatedAt: string;
  error?: string;
  recordCount?: number;
}
