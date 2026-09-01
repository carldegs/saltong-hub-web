import { describe, expect, it } from "vitest";
import { metadata } from "./page";
import { FILIPINO_WORDLE_LANDING_COPY, LANDING_GAMES } from "./copy";

describe("Filipino word-game landing page", () => {
  it("publishes an absolute, indexable Saltong Hub collection title", () => {
    expect(metadata).toMatchObject({
      title: { absolute: "Saltong Hub: Daily Filipino Word Games" },
      description:
        "Discover daily Filipino word games from Saltong Hub, including Saltong, Saltong Mini, Saltong Max, and Saltong Hex.",
      alternates: {
        canonical: "https://saltong.com/filipino-wordle",
      },
      robots: { index: true, follow: true },
      openGraph: {
        url: "https://saltong.com/filipino-wordle",
      },
    });
  });

  it("introduces the full Saltong Hub game collection", () => {
    expect(FILIPINO_WORDLE_LANDING_COPY.hero).toBe(
      "Discover Filipino Word Games on Saltong Hub"
    );
    expect(FILIPINO_WORDLE_LANDING_COPY.introduction).toContain("Saltong");
    expect(FILIPINO_WORDLE_LANDING_COPY.introduction).toContain("Mini");
    expect(FILIPINO_WORDLE_LANDING_COPY.introduction).toContain("Max");
    expect(FILIPINO_WORDLE_LANDING_COPY.introduction).toContain("Hex");
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
