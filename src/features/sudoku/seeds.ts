import { SudokuMode, SudokuSeedDifficulty } from "./types";

export const SUDOKU_SEED_DIFFICULTY_BY_MODE = {
  easy: "easy",
  medium: "medium",
  hard: "hard",
  bathala: "expert",
} as const satisfies Record<SudokuMode, SudokuSeedDifficulty>;

export function getSudokuSeed(date: string, mode: SudokuMode) {
  return `${date}:${SUDOKU_SEED_DIFFICULTY_BY_MODE[mode]}`;
}

export function getSudokuSeedForDifficulty(
  date: string,
  difficulty: SudokuSeedDifficulty
) {
  return `${date}:${difficulty}`;
}
