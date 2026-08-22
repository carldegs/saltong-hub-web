import { describe, expect, it } from "vitest";
import { getSudokuRoundIdFromDate, isSudokuDateBeforeStart } from "./utils";

describe("Sudoku daily rounds", () => {
  it("numbers Aug 22, 2026 as round 1", () => {
    expect(getSudokuRoundIdFromDate("2026-08-22")).toBe(1);
  });

  it("keeps dates before Aug 22, 2026 unavailable", () => {
    expect(isSudokuDateBeforeStart("2026-08-21")).toBe(true);
  });
});
