import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows public crawling and points to the canonical sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://saltong.com/sitemap.xml",
    });
  });
});
