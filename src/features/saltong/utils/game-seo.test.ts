import { describe, expect, it } from "vitest";
import { getSaltongGameSeo } from "./game-seo";

describe("Saltong game SEO", () => {
  it("uses a distinct public route and independent description per mode", () => {
    expect(getSaltongGameSeo("classic", false)).toMatchObject({
      path: "/play",
      description: "Play Saltong, a daily Filipino word game.",
    });
    expect(getSaltongGameSeo("mini", false)).toMatchObject({
      path: "/play/mini",
      description: "Play Saltong Mini, a daily Filipino word-game variant.",
    });
    expect(getSaltongGameSeo("max", false)).toMatchObject({
      path: "/play/max",
      description: "Play Saltong Max, a daily Filipino word-game variant.",
    });
  });

  it("marks dated game URLs noindex", () => {
    expect(getSaltongGameSeo("mini", true).indexing.robots).toEqual({
      index: false,
      follow: true,
    });
  });
});
