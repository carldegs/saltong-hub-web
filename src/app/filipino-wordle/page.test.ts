import { describe, expect, it } from "vitest";
import { metadata } from "./page";
import { FILIPINO_WORDLE_LANDING_COPY } from "./copy";

describe("Filipino word-game landing page", () => {
  it("publishes indexable, canonical Saltong metadata without competitor terms in its description", () => {
    expect(metadata).toMatchObject({
      title: "Saltong: A Daily Filipino Word Game",
      description:
        "Play Saltong, a daily Filipino word game built around Filipino language and words.",
      alternates: {
        canonical: "https://www.saltong.com/filipino-wordle",
      },
      robots: { index: true, follow: true },
      openGraph: {
        url: "https://www.saltong.com/filipino-wordle",
      },
    });
    expect(String(metadata.description)).not.toMatch(/wordle|spelling bee/i);
  });

  it("keeps the approved personal story and independence notice together", () => {
    expect(FILIPINO_WORDLE_LANDING_COPY.story).toContain("Inspired by Wordle");
    expect(FILIPINO_WORDLE_LANDING_COPY.story).toContain("650,000");
    expect(FILIPINO_WORDLE_LANDING_COPY.story).toContain("12 million");
    expect(FILIPINO_WORDLE_LANDING_COPY.independenceNotice).toBe(
      "Saltong is independently created and is not affiliated with or endorsed by Wordle or The New York Times."
    );
  });
});
