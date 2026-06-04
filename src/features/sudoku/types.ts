import { BaseConfig, BaseGameRegistry } from "../game-registry/types";
import { LucideIcon } from "lucide-react";

export type SudokuMode = "easy" | "medium" | "hard" | "bathala";

export type SudokuSeedDifficulty = "easy" | "medium" | "hard" | "expert";

export type SudokuRemovalRange = readonly [min: number, max: number];

export interface SudokuModeConfig {
  mode: SudokuMode;
  displayName: string;
  removalRange: SudokuRemovalRange;
  icon: LucideIcon;
}

export interface SudokuConfig
  extends BaseGameRegistry,
    BaseConfig,
    Readonly<{
      hasModes: true;
      startDate: string;
      vaultPath: string;
      modes: Readonly<Record<SudokuMode, SudokuModeConfig>>;
    }> {}

export type Pos = { col: number; row: number };

export interface SudokuCellState {
  value: number;
  pos: Pos;
  isGiven: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isHighlightedValue: boolean;
  isInvalidUserEntry: boolean;
  isInvalidGiven: boolean;
}
