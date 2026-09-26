import { z } from "zod";

import type { ArticleEditorInput, ArticleStatus } from "./types";

export const ARTICLE_GAME_IDS = ["classic", "mini", "max", "hex"] as const;

const articleStatusSchema = z.enum(["draft", "scheduled", "published"]);

export function normalizeArticleSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const articleEditorSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a URL-safe kebab-case slug"),
    summary: z.string().trim().min(1, "Summary is required"),
    tags: z.array(z.string().trim().min(1)).default([]),
    contentMarkdown: z.string().trim().min(1, "Article content is required"),
    status: articleStatusSchema,
    scheduledFor: z.string().nullable(),
  })
  .superRefine((value, context) => {
    if (value.status !== "scheduled") return;

    if (!value.scheduledFor || Number.isNaN(Date.parse(value.scheduledFor))) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledFor"],
        message: "A schedule time is required",
      });
      return;
    }

    if (new Date(value.scheduledFor).getTime() <= Date.now()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledFor"],
        message: "Schedule time must be in the future",
      });
    }
  });

export function isSlugConflictError(
  error: { code?: string; message?: string } | null | undefined
) {
  return (
    error?.code === "23505" &&
    error.message?.includes("articles_slug_key") === true
  );
}

export function isArticleStatus(value: string): value is ArticleStatus {
  return articleStatusSchema.safeParse(value).success;
}

export type ParsedArticleEditorInput = z.infer<typeof articleEditorSchema> &
  ArticleEditorInput;
