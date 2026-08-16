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
        url: "https://www.saltong.com/filipino-wordle",
        changeFrequency: "monthly",
        priority: 0.8,
      })
    );
  });
});
