import { describe, expect, it } from "vitest";
import { getResultDialogFeaturedGameList } from "./getResultDialogFeaturedGameList";

describe("getResultDialogFeaturedGameList", () => {
  it("places the vault first, new games next, and other games last", () => {
    const games = getResultDialogFeaturedGameList("classic");

    expect(games.map((game) => game.id)).toEqual([
      "vault",
      "sudoku",
      "mathinik",
      "mini",
      "max",
      "hex",
    ]);
    expect(games.filter((game) => game.isNew).map((game) => game.id)).toEqual([
      "sudoku",
      "mathinik",
    ]);
  });

  it("keeps the current new game's vault before the remaining new game", () => {
    const games = getResultDialogFeaturedGameList("sudoku");

    expect(games.slice(0, 2).map((game) => game.id)).toEqual([
      "vault",
      "mathinik",
    ]);
    expect(games[1]).toMatchObject({ isNew: true, href: "/play/mathinik" });
  });
});
