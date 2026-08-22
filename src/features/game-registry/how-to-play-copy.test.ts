import { describe, expect, it } from "vitest";
import { HOW_TO_PLAY_INTROS } from "./how-to-play-copy";

describe("How to Play introductions", () => {
  it("uses the approved objective copy for every playable game", () => {
    expect(HOW_TO_PLAY_INTROS).toEqual({
      saltongClassic: "Guess the five-letter Filipino word in six tries.",
      saltongMini: "Guess the four-letter Filipino word in five tries.",
      saltongMax: "Guess the seven-letter Filipino word in eight tries.",
      hex: "Find as many words as you can using the letters shown. Every word must include the center letter.",
      mathinik:
        "Combine the six numbers using +, −, ×, and ÷ to reach the target as fast as you can.",
      sudoku:
        "Fill the grid so every row, column, and 3×3 block contains the numbers 1 through 9 without repeats.",
    });
  });
});
