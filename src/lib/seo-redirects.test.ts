import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config.mjs";

describe("SEO redirects", () => {
  it("permanently redirects the retired blog route", async () => {
    await expect(nextConfig.redirects()).resolves.toContainEqual({
      source: "/blog",
      destination: "/patch-notes",
      permanent: true,
    });
  });
});
