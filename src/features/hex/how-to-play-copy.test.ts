import { describe, expect, it } from "vitest";
import { HEX_HOW_TO_PLAY_COPY } from "./how-to-play-copy";

describe("Hex how-to-play copy", () => {
  it("defines what a pangram is", () => {
    expect(HEX_HOW_TO_PLAY_COPY.pangramExplanation).toBe(
      "A pangram uses every letter in the puzzle, including the center letter."
    );
  });
});
