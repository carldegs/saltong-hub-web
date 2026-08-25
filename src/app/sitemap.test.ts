import { describe, expect, it, vi } from "vitest";

vi.mock("./patch-notes/utils", () => ({ getBlogPosts: () => [] }));

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("does not submit login-gated vault routes", () => {
    expect(sitemap().some((entry) => entry.url.includes("/vault"))).toBe(false);
  });

  it("submits the evergreen Filipino word-game landing page", () => {
    expect(sitemap()).toContainEqual(
      expect.objectContaining({
        url: "https://saltong.com/filipino-wordle",
        lastModified: new Date("2026-08-21T00:00:00.000Z"),
        changeFrequency: "monthly",
        priority: 0.8,
      })
    );
  });

  it("submits the evergreen Sudoku and Mathinik game pages", () => {
    expect(sitemap()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "https://saltong.com/play/sudoku",
          changeFrequency: "daily",
          priority: 1,
        }),
        expect.objectContaining({
          url: "https://saltong.com/play/mathinik",
          changeFrequency: "daily",
          priority: 1,
        }),
      ])
    );
  });
});
