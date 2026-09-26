import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  authResult: {
    data: { claims: { sub: "admin-1" } as { sub: string } | null },
    error: null as { message: string } | null,
  },
  allowed: true,
  nextError: null as { code?: string; message?: string } | null,
  existingPublishedAt: null as string | null,
  writes: [] as Array<Record<string, unknown>>,
  deletedIds: [] as string[],
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getClaims: vi.fn(async () => state.authResult) },
  })),
}));

vi.mock("@/lib/supabase/admin-server", () => ({
  createServiceRoleClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: {
              slug: "a-patch-note",
              published_at: state.existingPublishedAt,
            },
            error: null,
          }),
        }),
      }),
      insert: (write: Record<string, unknown>) => ({
        select: () => ({
          single: async () => {
            state.writes.push(write);
            return {
              data: state.nextError
                ? null
                : {
                    ...write,
                    id: "article-1",
                    legacy_hero_image: null,
                    created_at: "2026-09-26T00:00:00.000Z",
                    updated_at: "2026-09-26T00:00:00.000Z",
                  },
              error: state.nextError,
            };
          },
        }),
      }),
      update: (write: Record<string, unknown>) => ({
        eq: (_column: string, id: string) => ({
          select: () => ({
            single: async () => {
              state.writes.push(write);
              return {
                data: state.nextError
                  ? null
                  : {
                      ...write,
                      id,
                      slug: "update",
                      title: "Updated",
                      summary: "Updated summary",
                      tags: [],
                      content_markdown: "Updated content",
                      legacy_hero_image: null,
                      created_by: "admin-1",
                      created_at: "2026-09-26T00:00:00.000Z",
                      updated_at: "2026-09-26T00:00:00.000Z",
                    },
                error: state.nextError,
              };
            },
          }),
        }),
      }),
      delete: () => ({
        eq: async (_column: string, id: string) => {
          state.deletedIds.push(id);
          return { error: state.nextError };
        },
      }),
    })),
  })),
}));

vi.mock("@/app/api/admin/utils/is-allowed-admin", () => ({
  requireAllowedAdmin: async () => {
    if (!state.authResult.data.claims?.sub) {
      return { ok: false as const, error: "Unauthorized" as const };
    }

    if (!state.allowed) {
      return { ok: false as const, error: "Forbidden" as const };
    }

    return { ok: true as const, userId: state.authResult.data.claims.sub };
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import {
  changeArticleStatus,
  createArticle,
  deleteArticle,
  updateArticle,
} from "./actions";

const validDraft = {
  title: "A patch note",
  slug: "a-patch-note",
  summary: "A short summary",
  tags: ["update"],
  contentMarkdown: "## What changed",
  status: "draft" as const,
  scheduledFor: null,
};

describe("article admin actions", () => {
  beforeEach(() => {
    state.authResult = {
      data: { claims: { sub: "admin-1" } },
      error: null,
    };
    state.allowed = true;
    state.nextError = null;
    state.existingPublishedAt = null;
    state.writes = [];
    state.deletedIds = [];
  });

  it("rejects an unauthenticated author before a service write", async () => {
    state.authResult = { data: { claims: null }, error: null };

    await expect(createArticle(validDraft)).resolves.toEqual({
      ok: false,
      error: "Unauthorized",
    });
    expect(state.writes).toEqual([]);
  });

  it("rejects an authenticated author outside the admin allowlist", async () => {
    state.allowed = false;

    await expect(createArticle(validDraft)).resolves.toEqual({
      ok: false,
      error: "Forbidden",
    });
    expect(state.writes).toEqual([]);
  });

  it("returns a field-safe validation error for malformed article input", async () => {
    await expect(
      createArticle({ ...validDraft, title: "", slug: "Not URL safe" })
    ).resolves.toEqual({ ok: false, error: "Title is required" });
    expect(state.writes).toEqual([]);
  });

  it("maps a duplicate slug database error to an editor-safe error", async () => {
    state.nextError = {
      code: "23505",
      message:
        "duplicate key value violates unique constraint articles_slug_key",
    };

    await expect(createArticle(validDraft)).resolves.toEqual({
      ok: false,
      error: "An article with this slug already exists",
    });
  });

  it("saves a draft with its creator and no publication dates", async () => {
    const result = await createArticle(validDraft);

    expect(result.ok).toBe(true);
    expect(state.writes).toEqual([
      expect.objectContaining({
        created_by: "admin-1",
        status: "draft",
        scheduled_for: null,
        published_at: null,
      }),
    ]);
  });

  it("converts a Manila-local future schedule to UTC before saving", async () => {
    const result = await createArticle({
      ...validDraft,
      status: "scheduled",
      scheduledFor: "2099-01-01T09:00",
    });

    expect(result.ok).toBe(true);
    expect(state.writes).toEqual([
      expect.objectContaining({
        status: "scheduled",
        scheduled_for: "2099-01-01T01:00:00.000Z",
        published_at: null,
      }),
    ]);
  });

  it("publishes and unpublishes without replacing an existing publication time", async () => {
    await changeArticleStatus("article-1", "published");
    await changeArticleStatus("article-1", "draft");

    expect(state.writes).toEqual([
      expect.objectContaining({
        status: "published",
        published_at: expect.any(String),
        scheduled_for: null,
      }),
      expect.objectContaining({
        status: "draft",
        scheduled_for: null,
      }),
    ]);
  });

  it("keeps an article's first publication timestamp after unpublishing", async () => {
    state.existingPublishedAt = "2026-09-01T00:00:00.000Z";

    await changeArticleStatus("article-1", "draft");

    expect(state.writes).toEqual([
      expect.objectContaining({
        status: "draft",
        published_at: "2026-09-01T00:00:00.000Z",
      }),
    ]);
  });

  it("updates and deletes an article after authorization", async () => {
    const updated = await updateArticle("article-1", validDraft);
    const deleted = await deleteArticle("article-1");

    expect(updated.ok).toBe(true);
    expect(deleted).toEqual({ ok: true, article: null });
    expect(state.deletedIds).toEqual(["article-1"]);
  });
});
