"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  createArticle,
  deleteArticle,
  updateArticle,
} from "@/app/admin/patch-notes/actions";
import { Button } from "@/components/ui/button";
import { normalizeArticleSlug } from "../schema";
import type { Article, ArticleEditorInput, ArticleStatus } from "../types";
import { ArticleEditor } from "./article-editor";

const emptyArticle: ArticleEditorInput = {
  title: "",
  slug: "",
  summary: "",
  tags: [],
  contentMarkdown: "",
  status: "draft",
  scheduledFor: null,
};

export function ArticleEditorForm({ article }: { article?: Article }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(Boolean(article));
  const [input, setInput] = useState<ArticleEditorInput>(
    article
      ? {
          title: article.title,
          slug: article.slug,
          summary: article.summary,
          tags: article.tags,
          contentMarkdown: article.contentMarkdown,
          status: article.status,
          scheduledFor: article.scheduledFor?.slice(0, 16) ?? null,
        }
      : emptyArticle
  );

  const tagsValue = useMemo(() => input.tags.join(", "), [input.tags]);
  const update = (change: Partial<ArticleEditorInput>) =>
    setInput((current) => ({ ...current, ...change }));

  function save() {
    setError(null);
    startTransition(async () => {
      const result = article
        ? await updateArticle(article.id, input)
        : await createArticle(input);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin/patch-notes");
      router.refresh();
    });
  }

  function remove() {
    if (!article || !window.confirm(`Delete "${article.title}"?`)) return;

    startTransition(async () => {
      const result = await deleteArticle(article.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin/patch-notes");
      router.refresh();
    });
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Title
          <input
            required
            value={input.title}
            onChange={(event) => {
              const title = event.target.value;
              update({
                title,
                slug: slugEdited ? input.slug : normalizeArticleSlug(title),
              });
            }}
            className="bg-background rounded-md border px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Slug
          <input
            required
            value={input.slug}
            onChange={(event) => {
              setSlugEdited(true);
              update({ slug: normalizeArticleSlug(event.target.value) });
            }}
            className="bg-background rounded-md border px-3 py-2"
          />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-medium">
        Summary
        <textarea
          required
          value={input.summary}
          onChange={(event) => update({ summary: event.target.value })}
          className="bg-background min-h-20 rounded-md border px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Tags
        <input
          value={tagsValue}
          onChange={(event) =>
            update({
              tags: event.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            })
          }
          placeholder="release, community"
          className="bg-background rounded-md border px-3 py-2"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Status
          <select
            value={input.status}
            onChange={(event) =>
              update({ status: event.target.value as ArticleStatus })
            }
            className="bg-background rounded-md border px-3 py-2"
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </label>
        {input.status === "scheduled" && (
          <label className="grid gap-1 text-sm font-medium">
            Publish time (Asia/Manila)
            <input
              type="datetime-local"
              required
              value={input.scheduledFor ?? ""}
              onChange={(event) => update({ scheduledFor: event.target.value })}
              className="bg-background rounded-md border px-3 py-2"
            />
          </label>
        )}
      </div>
      <div className="grid gap-1">
        <span className="text-sm font-medium">Content</span>
        <ArticleEditor
          value={input.contentMarkdown}
          onChange={(contentMarkdown) => update({ contentMarkdown })}
        />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save article"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/patch-notes">Cancel</Link>
        </Button>
        {article && (
          <Button
            type="button"
            variant="destructive"
            onClick={remove}
            disabled={isPending}
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
