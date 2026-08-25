import { describe, expect, it } from "vitest";
import { metadata } from "./page";
import { FILIPINO_WORDLE_LANDING_COPY, LANDING_GAMES } from "./copy";

describe("Filipino word-game landing page", () => {
  it("publishes an absolute, indexable canonical title without competitor terms in its description", () => {
    expect(metadata).toMatchObject({
      title: { absolute: "Saltong: A Daily Filipino Word Game" },
      description:
        "Play Saltong, a daily Filipino word game built around Filipino language and words.",
      alternates: {
        canonical: "https://saltong.com/filipino-wordle",
      },
      robots: { index: true, follow: true },
      openGraph: {
        url: "https://saltong.com/filipino-wordle",
      },
    });
    expect(String(metadata.description)).not.toMatch(/wordle|spelling bee/i);
  });

  it("uses the target search language with the independence notice", () => {
    expect(FILIPINO_WORDLE_LANDING_COPY.searchCopy).toContain(
      "Filipino Wordle"
    );
    expect(FILIPINO_WORDLE_LANDING_COPY.searchCopy).toContain("Tagalog Wordle");
    expect(FILIPINO_WORDLE_LANDING_COPY.independenceNotice).toBe(
      "Saltong Hub is independently created and is not affiliated with or endorsed by Wordle, Spelling Bee, or The New York Times."
    );
  });

  it("gives visitors an immediate direct path into every Saltong game", () => {
    expect(LANDING_GAMES).toEqual([
      {
        name: "Saltong",
        href: "/play",
        icon: "/main.svg",
        color: "green",
      },
      {
        name: "Saltong Mini",
        href: "/play/mini",
        icon: "/mini.svg",
        color: "blue",
      },
      {
        name: "Saltong Max",
        href: "/play/max",
        icon: "/max.svg",
        color: "red",
      },
      {
        name: "Saltong Hex",
        href: "/play/hex",
        icon: "/hex.svg",
        color: "purple",
      },
    ]);
  });
});
