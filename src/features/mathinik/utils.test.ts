import { describe, expect, it } from "vitest";
import { getMathinikRoundIdFromDate, isMathinikDateBeforeStart } from "./utils";

describe("Mathinik daily rounds", () => {
  it("numbers Aug 22, 2026 as round 1", () => {
    expect(getMathinikRoundIdFromDate("2026-08-22")).toBe(1);
  });

  it("keeps dates before Aug 22, 2026 unavailable", () => {
    expect(isMathinikDateBeforeStart("2026-08-21")).toBe(true);
  });
});
