import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({})),
}));
vi.mock("@/features/articles/repository", () => ({
  listPublicArticles: vi.fn(async () => []),
}));

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("does not submit login-gated vault routes", async () => {
    expect(
      (await sitemap()).some((entry) => entry.url.includes("/vault"))
    ).toBe(false);
  });

  it("submits the evergreen Filipino word-game landing page", async () => {
    expect(await sitemap()).toContainEqual(
      expect.objectContaining({
        url: "https://saltong.com/filipino-wordle",
        lastModified: new Date("2026-08-21T00:00:00.000Z"),
        changeFrequency: "monthly",
        priority: 0.8,
      })
    );
  });

  it("marks the homepage as updated with the latest site release", async () => {
    expect(await sitemap()).toContainEqual(
      expect.objectContaining({
        url: "https://saltong.com",
        lastModified: new Date("2026-09-09T00:00:00.000Z"),
      })
    );
  });

  it("submits the public how-to-play directory and game guides", async () => {
    expect(await sitemap()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "https://saltong.com/how-to-play",
          changeFrequency: "monthly",
        }),
        expect.objectContaining({
          url: "https://saltong.com/how-to-play/saltong",
          changeFrequency: "monthly",
        }),
        expect.objectContaining({
          url: "https://saltong.com/how-to-play/mathinik",
          changeFrequency: "monthly",
        }),
      ])
    );
  });

  it("submits the evergreen Sudoku and Mathinik game pages", async () => {
    expect(await sitemap()).toEqual(
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

  it("uses stable last-modified values rather than the request time", async () => {
    const entries = await sitemap();
    const laterEntries = await sitemap();

    expect(entries).toEqual(laterEntries);
  });
});
