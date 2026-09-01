import { describe, expect, it } from "vitest";
import { getBlogPosts } from "./utils";

describe("patch notes", () => {
  it("publishes the Saltong tips and tricks guide", () => {
    expect(getBlogPosts()).toContainEqual(
      expect.objectContaining({
        slug: "saltong-tips-and-tricks",
        metadata: expect.objectContaining({
          title: "Saltong Tips and Tricks for Competitive Folks Like You",
          publishedAt: "2026-09-01",
          tags: ["guide", "tips"],
        }),
      })
    );
  });
});
