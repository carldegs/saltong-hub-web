"use server";

import { revalidatePath } from "next/cache";
import { fromZonedTime } from "date-fns-tz";

import { requireAllowedAdmin } from "@/app/api/admin/utils/is-allowed-admin";
import {
  isArticleStatus,
  isSlugConflictError,
  articleEditorSchema,
} from "@/features/articles/schema";
import type {
  Article,
  ArticleEditorInput,
  ArticleStatus,
} from "@/features/articles/types";
import { createServiceRoleClient } from "@/lib/supabase/admin-server";
import type { Database } from "@/lib/supabase/types";
import { PH_TIMEZONE } from "@/utils/time";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
type ActionResult =
  { ok: true; article: Article | null } | { ok: false; error: string };

function toArticle(row: ArticleRow): Article {
  if (!isArticleStatus(row.status)) {
    throw new Error("Invalid article status");
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    tags: row.tags,
    contentMarkdown: row.content_markdown,
    status: row.status,
    scheduledFor: row.scheduled_for,
    publishedAt: row.published_at,
    legacyHeroImage: row.legacy_hero_image,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function formatError(error: { code?: string; message?: string } | null) {
  if (isSlugConflictError(error)) {
    return "An article with this slug already exists";
  }

  return error?.message ?? "Unable to save article";
}

function toScheduledFor(value: string | null) {
  return value ? fromZonedTime(value, PH_TIMEZONE).toISOString() : null;
}

function articleWrite(
  input: ArticleEditorInput,
  createdBy: string,
  publishedAt: string | null
) {
  return {
    title: input.title.trim(),
    slug: input.slug,
    summary: input.summary.trim(),
    tags: input.tags,
    content_markdown: input.contentMarkdown.trim(),
    status: input.status,
    scheduled_for:
      input.status === "scheduled" ? toScheduledFor(input.scheduledFor) : null,
    published_at: publishedAt,
    created_by: createdBy,
  };
}

function revalidateArticlePaths(slug: string) {
  revalidatePath("/patch-notes");
  revalidatePath(`/patch-notes/${slug}`);
  revalidatePath("/admin/patch-notes");
}

async function getArticleLifecycle(id: string) {
  const client = createServiceRoleClient();
  const { data, error } = await client
    .from("articles")
    .select("slug, published_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Article not found");
  return data;
}

export async function createArticle(
  input: ArticleEditorInput
): Promise<ActionResult> {
  const access = await requireAllowedAdmin();
  if (!access.ok) return access;

  const parsed = articleEditorSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid article",
    };
  }

  const client = createServiceRoleClient();
  const publishedAt =
    parsed.data.status === "published" ? new Date().toISOString() : null;
  const { data, error } = await client
    .from("articles")
    .insert(articleWrite(parsed.data, access.userId, publishedAt))
    .select()
    .single();

  if (error || !data) return { ok: false, error: formatError(error) };

  const article = toArticle(data);
  revalidateArticlePaths(article.slug);
  return { ok: true, article };
}

export async function updateArticle(
  id: string,
  input: ArticleEditorInput
): Promise<ActionResult> {
  const access = await requireAllowedAdmin();
  if (!access.ok) return access;

  const parsed = articleEditorSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid article",
    };
  }

  try {
    const current = await getArticleLifecycle(id);
    const publishedAt =
      current.published_at ??
      (parsed.data.status === "published" ? new Date().toISOString() : null);
    const client = createServiceRoleClient();
    const { data, error } = await client
      .from("articles")
      .update(articleWrite(parsed.data, access.userId, publishedAt))
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return { ok: false, error: formatError(error) };

    const article = toArticle(data);
    revalidateArticlePaths(current.slug);
    if (article.slug !== current.slug) revalidateArticlePaths(article.slug);
    return { ok: true, article };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to save article",
    };
  }
}

export async function changeArticleStatus(
  id: string,
  status: ArticleStatus,
  scheduledFor: string | null = null
): Promise<ActionResult> {
  const access = await requireAllowedAdmin();
  if (!access.ok) return access;

  const parsed = articleEditorSchema.safeParse({
    title: "Status update",
    slug: "status-update",
    summary: "Status update",
    tags: [],
    contentMarkdown: "Status update",
    status,
    scheduledFor,
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid status",
    };
  }

  try {
    const current = await getArticleLifecycle(id);
    const client = createServiceRoleClient();
    const { data, error } = await client
      .from("articles")
      .update({
        status,
        scheduled_for:
          status === "scheduled" ? toScheduledFor(scheduledFor) : null,
        published_at:
          current.published_at ??
          (status === "published" ? new Date().toISOString() : null),
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return { ok: false, error: formatError(error) };

    const article = toArticle(data);
    revalidateArticlePaths(current.slug);
    return { ok: true, article };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unable to update article",
    };
  }
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  const access = await requireAllowedAdmin();
  if (!access.ok) return access;

  try {
    const current = await getArticleLifecycle(id);
    const client = createServiceRoleClient();
    const { error } = await client.from("articles").delete().eq("id", id);
    if (error) return { ok: false, error: formatError(error) };

    revalidateArticlePaths(current.slug);
    return { ok: true, article: null };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unable to delete article",
    };
  }
}
