import { describe, expect, it } from "vitest";
import { OTHER_GAMES } from "./other-games";

describe("other games sidebar menu", () => {
  it("features Singtonado with its dedicated logo", () => {
    expect(OTHER_GAMES).toEqual([
      {
        href: "https://singtonado.com/",
        icon: "/singtonado.png",
        name: "Singtonado",
      },
    ]);
  });
});
