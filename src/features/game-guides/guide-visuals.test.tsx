import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HexWordCells } from "./hex-guide-visual";

describe("game guide visuals", () => {
  it("highlights the center letter in Hex example word cells", () => {
    const markup = renderToStaticMarkup(
      createElement(HexWordCells, {
        word: "KESO",
        centerLetter: "O",
        pointsLabel: "1 pt.",
      })
    );

    expect(markup).toContain("bg-saltong-purple dark:bg-saltong-purple");
    expect(markup).toContain("= 1 pt.");
    expect(markup).toContain("gap-1.5");
  });
});
