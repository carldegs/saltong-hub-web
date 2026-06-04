import { DATE_FORMAT, getFormattedDateInPh } from "@/utils/time";
import { differenceInDays, parse } from "date-fns";
import { SUDOKU_CONFIG } from "./config";
import { Pos, SudokuMode } from "./types";

export function isSudokuMode(value: string): value is SudokuMode {
  return value in SUDOKU_CONFIG.modes;
}

export function getSudokuModeConfig(mode: SudokuMode) {
  return SUDOKU_CONFIG.modes[mode];
}

export function getSudokuGameDate(date?: string) {
  return date ?? getFormattedDateInPh();
}

export function getSudokuRoundIdFromDate(date: string) {
  const targetDate = parse(date, DATE_FORMAT, new Date());
  const startDate = parse(SUDOKU_CONFIG.startDate, DATE_FORMAT, new Date());

  return differenceInDays(targetDate, startDate) + 1;
}

export function isSudokuDateBeforeStart(date: string) {
  return getSudokuRoundIdFromDate(date) < 1;
}

export function getIdxFromPos(pos: Pos, gridSize = 9) {
  return pos.row * gridSize + pos.col;
}

export function getPosFromIdx(idx: number, gridSize = 9) {
  return { row: Math.floor(idx / gridSize), col: idx % gridSize } satisfies Pos;
}

export function getBlockFromPos(pos: Pos, gridSize = 9) {
  const blockSize = Math.sqrt(gridSize);

  return (
    Math.floor(pos.row / blockSize) * blockSize +
    Math.floor(pos.col / blockSize)
  );
}
