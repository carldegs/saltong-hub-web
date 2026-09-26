import { describe, expect, it } from "vitest";
import { parsePlayGamesDirective } from "./directives";

describe("play-games directive", () => {
  it("normalizes known game IDs", () => {
    expect(
      parsePlayGamesDirective("play-games", { games: "classic mini max" })
    ).toEqual(["classic", "mini", "max"]);
  });

  it("rejects unknown directives and attributes", () => {
    expect(parsePlayGamesDirective("unknown", { games: "classic" })).toBeNull();
    expect(
      parsePlayGamesDirective("play-games", { games: "classic rogue" })
    ).toBeNull();
    expect(parsePlayGamesDirective("play-games", {})).toBeNull();
    expect(
      parsePlayGamesDirective("play-games", {
        games: "classic",
        style: "dangerous",
      })
    ).toBeNull();
  });
});
