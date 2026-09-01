import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  DM_Sans: () => ({ className: "", variable: "" }),
}));

import { metadata } from "./page";

describe("homepage metadata", () => {
  it("describes Saltong Hub as a collection of Filipino word games", () => {
    expect(metadata).toMatchObject({
      title: { absolute: "Daily Filipino Word Games | Saltong Hub" },
      description:
        "Play daily Filipino word games and puzzles from Saltong Hub, including Saltong, Mini, Max, Hex, Sudoku, and Mathinik.",
      openGraph: {
        description:
          "Play daily Filipino word games and puzzles from Saltong Hub, including Saltong, Mini, Max, Hex, Sudoku, and Mathinik.",
      },
    });
  });
});
