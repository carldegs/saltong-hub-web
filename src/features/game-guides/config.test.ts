import { describe, expect, it } from "vitest";
import { GAME_GUIDES } from "./config";

describe("game guide routes", () => {
  it("defines one public how-to-play route for every game", () => {
    expect(GAME_GUIDES.map((guide) => guide.path)).toEqual([
      "/how-to-play/saltong",
      "/how-to-play/mini",
      "/how-to-play/max",
      "/how-to-play/hex",
      "/how-to-play/sudoku",
      "/how-to-play/mathinik",
    ]);
  });
});
