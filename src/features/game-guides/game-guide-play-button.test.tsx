import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GAME_GUIDES } from "./config";
import { GameGuidePlayButton } from "./game-guide-play-button";

describe("game guide play button", () => {
  it("links to the game with its logo and themed CTA", () => {
    const markup = renderToStaticMarkup(
      createElement(GameGuidePlayButton, { guide: GAME_GUIDES[0] })
    );

    expect(markup).toContain('href="/play"');
    expect(markup).toContain('src="/main.svg"');
    expect(markup).toContain("Play Saltong Classic Now");
    expect(markup).toContain("bg-saltong-green-500");
  });
});
