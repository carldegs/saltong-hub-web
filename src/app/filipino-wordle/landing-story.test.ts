import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LandingStory } from "./landing-story";

describe("LandingStory", () => {
  it("presents Saltong Hub's independent game origins", () => {
    const story = renderToStaticMarkup(createElement(LandingStory));

    expect(story).toContain("Saltong Hub");
    expect(story).toContain("How Saltong began");
    expect(story).toContain("Inspired by Wordle");
    expect(story).toContain("Spelling Bee");
    expect(story).toContain("650,000 players");
    expect(story).toContain("12 million pageviews");
  });
});
