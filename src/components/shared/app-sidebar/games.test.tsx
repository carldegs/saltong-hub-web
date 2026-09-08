import { describe, expect, it } from "vitest";
import { GAMES } from "./games";

describe("game sidebar links", () => {
  it("places public how-to-play after Vault in every game submenu", () => {
    const guidePaths = [
      "/how-to-play/saltong",
      "/how-to-play/max",
      "/how-to-play/mini",
      "/how-to-play/hex",
      "/how-to-play/sudoku",
      "/how-to-play/mathinik",
    ];

    for (const [index, game] of GAMES.entries()) {
      const vaultIndex = game.sub?.findIndex((item) => item.name === "Vault");

      expect(vaultIndex).toBeGreaterThanOrEqual(0);
      expect(game.sub?.[vaultIndex! + 1]).toMatchObject({
        href: guidePaths[index],
        name: "How to Play",
      });
    }
  });
});
