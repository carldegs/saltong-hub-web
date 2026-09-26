import { describe, expect, it } from "vitest";
import {
  articleEditorSchema,
  isSlugConflictError,
  normalizeArticleSlug,
} from "./schema";

describe("article editor validation", () => {
  const validArticle = {
    title: "A published update",
    slug: "a-published-update",
    summary: "A concise update summary.",
    tags: ["update"],
    contentMarkdown: "## Update",
    status: "draft",
    scheduledFor: null,
  };

  it("requires a title, summary, and Markdown body", () => {
    expect(
      articleEditorSchema.safeParse({ ...validArticle, title: "" }).success
    ).toBe(false);
    expect(
      articleEditorSchema.safeParse({ ...validArticle, summary: "" }).success
    ).toBe(false);
    expect(
      articleEditorSchema.safeParse({ ...validArticle, contentMarkdown: "" })
        .success
    ).toBe(false);
  });

  it("accepts only a URL-safe kebab-case slug", () => {
    expect(
      articleEditorSchema.safeParse({ ...validArticle, slug: "Not A Slug" })
        .success
    ).toBe(false);
    expect(normalizeArticleSlug("  A New Update!  ")).toBe("a-new-update");
  });

  it("requires a future schedule for scheduled articles", () => {
    expect(
      articleEditorSchema.safeParse({
        ...validArticle,
        status: "scheduled",
        scheduledFor: null,
      }).success
    ).toBe(false);
    expect(
      articleEditorSchema.safeParse({
        ...validArticle,
        status: "scheduled",
        scheduledFor: "2000-01-01T00:00",
      }).success
    ).toBe(false);
    expect(
      articleEditorSchema.safeParse({
        ...validArticle,
        status: "scheduled",
        scheduledFor: "2099-01-01T09:00",
      }).success
    ).toBe(true);
  });

  it("recognizes a database slug conflict", () => {
    expect(
      isSlugConflictError({
        code: "23505",
        message:
          "duplicate key value violates unique constraint articles_slug_key",
      })
    ).toBe(true);
    expect(
      isSlugConflictError({ code: "23514", message: "invalid status" })
    ).toBe(false);
  });
});
