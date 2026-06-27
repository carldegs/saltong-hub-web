import { Boxes, Grid2X2, Grid3X3, SquareIcon } from "lucide-react";
import { getSudokuDifficultySelectorPath, getSudokuVaultPath } from "./paths";
import { SudokuConfig, SudokuMode, SudokuModeConfig } from "./types";

export const SUDOKU_MODES = {
  easy: {
    mode: "easy",
    displayName: "Easy",
    removalRange: [32, 45],
    icon: SquareIcon,
  },
  medium: {
    mode: "medium",
    displayName: "Medium",
    removalRange: [46, 49],
    icon: Grid2X2,
  },
  hard: {
    mode: "hard",
    displayName: "Hard",
    removalRange: [50, 53],
    icon: Grid3X3,
  },
  bathala: {
    mode: "bathala",
    displayName: "Bathala",
    removalRange: [54, 59],
    icon: Boxes,
  },
} as const satisfies Record<SudokuMode, SudokuModeConfig>;

export const SUDOKU_CONFIG = {
  id: "sudoku",
  displayName: "Sudoku",
  path: getSudokuDifficultySelectorPath(),
  vaultPath: getSudokuVaultPath(),
  icon: "/sudoku.svg",
  blurb:
    "Place the numbers so everything fits perfectly together, one clue at a time.",
  colorScheme: "orange",
  startDate: "2026-06-19",
  hasModes: true,
  modes: SUDOKU_MODES,
} as const satisfies SudokuConfig;
