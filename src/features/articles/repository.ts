import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

import { isArticleStatus } from "./schema";
import type { Article } from "./types";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
type ArticleClient = SupabaseClient<Database>;

function toArticle(row: ArticleRow): Article {
  if (!isArticleStatus(row.status)) {
    throw new Error(`Unknown article status: ${row.status}`);
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

export function isPubliclyVisible(article: Article, now = new Date()) {
  return (
    article.status === "published" ||
    (article.status === "scheduled" &&
      article.scheduledFor !== null &&
      new Date(article.scheduledFor) <= now)
  );
}

function visibilityDate(article: Article) {
  return article.publishedAt ?? article.scheduledFor ?? article.createdAt;
}

export function sortPublicArticles(articles: Article[], now = new Date()) {
  return articles
    .filter((article) => isPubliclyVisible(article, now))
    .sort(
      (left, right) =>
        new Date(visibilityDate(right)).getTime() -
        new Date(visibilityDate(left)).getTime()
    );
}

export async function listPublicArticles(
  client: ArticleClient,
  now = new Date()
) {
  const { data, error } = await client
    .from("articles")
    .select("*")
    .or(
      `status.eq.published,and(status.eq.scheduled,scheduled_for.lte.${now.toISOString()})`
    );

  if (error) throw error;
  return sortPublicArticles((data ?? []).map(toArticle), now);
}

export async function getPublicArticleBySlug(
  client: ArticleClient,
  slug: string,
  now = new Date()
) {
  const articles = await listPublicArticles(client, now);
  return articles.find((article) => article.slug === slug) ?? null;
}

export async function listAdminArticles(client: ArticleClient) {
  const { data, error } = await client.from("articles").select("*");
  if (error) throw error;
  return (data ?? [])
    .map(toArticle)
    .sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    );
}
