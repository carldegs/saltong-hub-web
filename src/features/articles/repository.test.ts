import { describe, expect, it } from "vitest";
import { isPubliclyVisible, sortPublicArticles } from "./repository";
import type { Article } from "./types";

const article = (overrides: Partial<Article>): Article => ({
  id: "article-id",
  slug: "article",
  title: "Article",
  summary: "Summary",
  tags: [],
  contentMarkdown: "## Article",
  status: "draft",
  scheduledFor: null,
  publishedAt: null,
  legacyHeroImage: null,
  createdBy: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("public article visibility", () => {
  const now = new Date("2026-09-26T08:00:00.000Z");

  it("excludes drafts and future scheduled articles", () => {
    expect(isPubliclyVisible(article({ status: "draft" }), now)).toBe(false);
    expect(
      isPubliclyVisible(
        article({
          status: "scheduled",
          scheduledFor: "2026-09-26T09:00:00.000Z",
        }),
        now
      )
    ).toBe(false);
  });

  it("includes published and due scheduled articles in newest-first order", () => {
    const articles = [
      article({
        slug: "old",
        status: "published",
        publishedAt: "2026-09-01T00:00:00.000Z",
      }),
      article({
        slug: "due",
        status: "scheduled",
        scheduledFor: "2026-09-26T07:00:00.000Z",
      }),
      article({
        slug: "future",
        status: "scheduled",
        scheduledFor: "2026-09-26T09:00:00.000Z",
      }),
    ];

    expect(sortPublicArticles(articles, now).map((item) => item.slug)).toEqual([
      "due",
      "old",
    ]);
  });
});
