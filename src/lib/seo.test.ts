import { describe, expect, it } from "vitest";
import { SITE_URL, canonicalUrl, pageIndexingMetadata } from "./seo";

describe("SEO metadata", () => {
  it("uses the apex host for public canonical URLs", () => {
    expect(SITE_URL).toBe("https://saltong.com");
    expect(canonicalUrl("/play/mini")).toBe("https://saltong.com/play/mini");
  });

  it("keeps canonical pages indexable", () => {
    expect(pageIndexingMetadata("/play", true)).toEqual({
      alternates: { canonical: "https://saltong.com/play" },
      robots: { index: true, follow: true },
    });
  });

  it("prevents historical or gated pages from being indexed", () => {
    expect(pageIndexingMetadata("/play/mini", false)).toEqual({
      alternates: { canonical: "https://saltong.com/play/mini" },
      robots: { index: false, follow: true },
    });
  });

  it("marks a vault route noindex while retaining its canonical destination", () => {
    expect(pageIndexingMetadata("/play/mini/vault", false)).toEqual({
      alternates: {
        canonical: "https://saltong.com/play/mini/vault",
      },
      robots: { index: false, follow: true },
    });
  });
});
