import { SudokuMode } from "./types";

export function getSudokuDifficultySelectorPath() {
  return "/sudoku";
}

export function getSudokuGamePath(mode: SudokuMode) {
  return `/sudoku/${mode}`;
}

export function getSudokuVaultPath() {
  return "/sudoku/vault";
}

export function getSudokuVaultGamePath({
  date,
  mode,
}: {
  date: string;
  mode: SudokuMode;
}) {
  return `${getSudokuGamePath(mode)}?d=${date}`;
}
