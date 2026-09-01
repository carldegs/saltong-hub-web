import { Tables } from "@/lib/supabase/types";
import { BaseConfig, BaseGameRegistry } from "../game-registry/types";
import { LucideIcon } from "lucide-react";

export type SudokuMode = "easy" | "medium" | "hard" | "bathala";

export type SudokuSeedDifficulty = "easy" | "medium" | "hard" | "expert";

export type SudokuUserRound = Tables<"sudoku-user-rounds">;

export type SudokuUserRoundPrimaryKeys = Pick<
  SudokuUserRound,
  "userId" | "date" | "mode"
>;

export type SudokuRemovalRange = readonly [min: number, max: number];

export interface SudokuModeConfig {
  mode: SudokuMode;
  displayName: string;
  removalRange: SudokuRemovalRange;
  icon: LucideIcon;
}

export interface SudokuConfig
  extends
    BaseGameRegistry,
    BaseConfig,
    Readonly<{
      hasModes: true;
      startDate: string;
      vaultPath: string;
      modes: Readonly<Record<SudokuMode, SudokuModeConfig>>;
    }> {}

export type Pos = { col: number; row: number };

export type SudokuInputMode = "solution" | "candidates";

export type SudokuCellHighlightState =
  "idle" | "related" | "same-value" | "selected";

export type SudokuCellAnswerState =
  "none" | "correct" | "user-error" | "given-error";

export type SudokuUserCheckState = "correct" | "incorrect" | null;

export interface SudokuCellVisualState {
  highlight: SudokuCellHighlightState;
  answer: SudokuCellAnswerState;
}

export interface SudokuCellState {
  value: number;
  candidates: number[];
  pos: Pos;
  isGiven: boolean;
  isCorrectUserEntry: boolean;
  userCheckState: SudokuUserCheckState;
  visualState: SudokuCellVisualState;
}
