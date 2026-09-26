import { describe, expect, it } from "vitest";
import { extractArticleHeadings } from "./headings";

describe("article headings", () => {
  it("extracts h2 and h3 anchors from Markdown", () => {
    expect(
      extractArticleHeadings("# Title\n\n## What's New?\n\n### Details")
    ).toEqual([
      { level: 2, text: "What's New?", id: "whats-new" },
      { level: 3, text: "Details", id: "details" },
    ]);
  });
});
