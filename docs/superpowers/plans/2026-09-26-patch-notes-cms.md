# Patch Notes CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace filesystem-authored Patch Notes with secure Supabase-backed articles and an in-app Tiptap editorial workflow.

**Architecture:** `public.articles` owns article state and public visibility. Server-only admin actions authorize the existing allowlist before using the service-role client; public Patch Notes routes use a safe Markdown renderer over eligible rows. Tiptap edits the same constrained Markdown format, including a single validated `play-games` directive.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase/Postgres/RLS, Vitest, Tiptap, `react-markdown`, `remark-gfm`, `remark-directive`, Zod.

**Spec:** `docs/superpowers/specs/2026-09-26-patch-notes-cms-design.md`

## Global Constraints

- Begin implementation from `origin/main` so the 2026-09-01 `saltong-tips-and-tricks` article and its related Patch Notes updates are present.
- The production table name is exactly `public.articles`; it is Patch Notes-only in v1.
- Persist plain Markdown in `content_markdown`; never execute stored content with `MDXRemote` or `CustomMDX`.
- Only `play-games` is a v1 custom directive; accepted game IDs are `classic`, `mini`, `max`, and `hex`.
- Store dates as `timestamptz`; enter and display scheduled times in Asia/Manila.
- Keep public URLs `/patch-notes` and `/patch-notes/[slug]` unchanged.
- Reuse `ADMIN_USER_IDS` and require the server-side allowlist check for every mutation.
- Do not add a media upload or image selection UI.
- Do not manually edit `src/lib/supabase/types.ts`; regenerate it locally with `pnpm supabase:typegen` after migrations are applied, and review its diff.

## Review Focus

- A future `scheduled` article must remain invisible to an anonymous API/read query and become eligible immediately after its `scheduled_for` timestamp; cover in Task 1 SQL tests and Task 2 visibility tests.
- A non-admin who invokes a mutation directly must receive `401` or `403`, regardless of access to an admin URL; cover in Task 4 action tests.
- A duplicate or malformed slug must be rejected instead of being silently rewritten; cover in Task 2 schema tests and Task 4 mutation tests.
- An unknown directive, invalid attribute, or non-allowlisted game ID must neither render a component nor execute markup; cover in Task 3 directive tests.
- Markdown produced by the editor for tables and `play-games` must survive a load/save round trip; cover in Task 5 editor tests.

---

## File structure

| Path | Responsibility |
| --- | --- |
| `supabase/migrations/20260926000000_create_articles.sql` | `articles` schema, constraints, RLS, public visibility policy, timestamp trigger, and three migrated rows. |
| `supabase/tests/articles.test.sql` | pgTAP coverage for schema constraints and public visibility/RLS behavior. |
| `src/features/articles/types.ts` | Domain types shared by repository, renderer, actions, and UI. |
| `src/features/articles/schema.ts` | Zod schemas and pure status/date/slug validation. |
| `src/features/articles/repository.ts` | Typed public and admin article fetch operations; no JSX or auth decisions. |
| `src/features/articles/markdown/*` | Safe Markdown renderer, heading extraction, directive parser/transformer, and game-card component mapping. |
| `src/features/articles/editor/*` | Client-only Tiptap configuration, `play-games` editor node, and article editor form. |
| `src/app/admin/patch-notes/*` | Admin list, create, and edit route components. |
| `src/app/admin/patch-notes/actions.ts` | Authenticated server mutations and route revalidation. |
| `src/app/patch-notes/*` | Existing public routes switched from filesystem MDX to repository data. |

### Task 1: Create and verify the Articles database contract

**Files:**
- Create: `supabase/migrations/20260926000000_create_articles.sql`
- Create: `supabase/tests/articles.test.sql`
- Modify: `src/lib/supabase/types.ts` (generated only)

**Interfaces:**
- Produces: `public.articles` with `id`, `slug`, `title`, `summary`, `tags`, `content_markdown`, `status`, `scheduled_for`, `published_at`, `legacy_hero_image`, `created_by`, `created_at`, and `updated_at`.
- Produces: public eligibility invariant `status = 'published' OR (status = 'scheduled' AND scheduled_for <= now())`.
- Produces: generated `Database["public"]["Tables"]["articles"]` types consumed by Tasks 2 and 4.

- [ ] **Step 1: Write the failing pgTAP tests in `supabase/tests/articles.test.sql`**

Assert the table and `status` check exist; assert duplicate slugs fail; use `set_config('role', 'anon', true)` or the repository's established test role technique to prove published and due scheduled rows are selectable while draft and future rows are not. Assert anonymous insert, update, and delete fail.

- [ ] **Step 2: Run the database test to verify it fails**

Run: `supabase test db supabase/tests/articles.test.sql`

Expected: FAIL because `public.articles` does not exist.

- [ ] **Step 3: Implement `public.articles` in `supabase/migrations/20260926000000_create_articles.sql`**

Use UUID primary keys, a unique slug constraint, `text[] NOT NULL DEFAULT '{}'`, a status check limited to `draft`, `scheduled`, and `published`, and `timestamptz` audit fields. Add checks requiring `scheduled_for` for scheduled rows and `published_at` for published rows. Enable RLS; grant anonymous/authenticated `SELECT` only through a public-eligibility policy and grant no browser write policy. Add the existing `set_updated_at` trigger.

Seed the three `origin/main` post slugs. Preserve metadata and legacy image paths; convert the tips table to GFM and replace its MDX card grid with `:::play-games{games="classic mini max"}`. Store the historical posts as `published` with their historical `published_at` values.

- [ ] **Step 4: Apply the migration and regenerate Supabase types**

Run: `supabase start && supabase db reset && pnpm supabase:typegen`

Expected: local migration completes; the generated types include `articles` and its status union/table row shape.

- [ ] **Step 5: Run database tests and inspect generated types**

Run: `supabase test db supabase/tests/articles.test.sql && git diff --check && git diff -- src/lib/supabase/types.ts`

Expected: PASS; only the expected generated `articles` additions appear.

- [ ] **Step 6: Commit the database contract**

```bash
git add supabase/migrations/20260926000000_create_articles.sql supabase/tests/articles.test.sql src/lib/supabase/types.ts
git commit -m "feat: add patch note articles schema"
```

### Task 2: Build the typed article domain, validation, and public repository

**Files:**
- Create: `src/features/articles/types.ts`
- Create: `src/features/articles/schema.ts`
- Create: `src/features/articles/repository.ts`
- Create: `src/features/articles/schema.test.ts`
- Create: `src/features/articles/repository.test.ts`

**Interfaces:**
- Consumes: generated `articles` types from Task 1.
- Produces: `ArticleStatus`, `Article`, `ArticleEditorInput`, `isPubliclyVisible(article, now)`, `articleEditorSchema`, `listPublicArticles(client, now)`, `getPublicArticleBySlug(client, slug, now)`, and `listAdminArticles(client)`.
- Used by: Tasks 3, 4, 5, and 6.

- [ ] **Step 1: Write failing tests for pure validation and visibility**

In `schema.test.ts`, assert title, summary, and Markdown body are required; reject a non-kebab-case slug and a duplicate-slug conflict mapping; require a future schedule timestamp for `scheduled`; allow only the four game IDs. In `repository.test.ts`, mock the Supabase query boundary and assert draft/future scheduled records are excluded while published/due scheduled records sort newest eligible publication first.

- [ ] **Step 2: Run the focused tests to verify they fail**

Run: `pnpm exec vitest run src/features/articles/schema.test.ts src/features/articles/repository.test.ts`

Expected: FAIL because article domain modules do not exist.

- [ ] **Step 3: Implement domain interfaces in `src/features/articles/{types,schema,repository}.ts`**

Define `ArticleStatus = "draft" | "scheduled" | "published"`. Make `ArticleEditorInput` include title, slug, summary, tags, contentMarkdown, status, and nullable Manila-local schedule input. Centralize slug normalization separately from validation so actions can reject a user-selected collision. Repository public methods must enforce the eligibility predicate in the Supabase query and accept a `now` parameter for deterministic tests.

- [ ] **Step 4: Run focused tests to verify they pass**

Run: `pnpm exec vitest run src/features/articles/schema.test.ts src/features/articles/repository.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the article domain**

```bash
git add src/features/articles/types.ts src/features/articles/schema.ts src/features/articles/repository.ts src/features/articles/schema.test.ts src/features/articles/repository.test.ts
git commit -m "feat: add article domain helpers"
```

### Task 3: Implement safe Patch Notes Markdown rendering

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/features/articles/markdown/directives.ts`
- Create: `src/features/articles/markdown/article-markdown.tsx`
- Create: `src/features/articles/markdown/play-games.tsx`
- Create: `src/features/articles/markdown/headings.ts`
- Create: `src/features/articles/markdown/directives.test.ts`
- Create: `src/features/articles/markdown/headings.test.ts`

**Interfaces:**
- Consumes: `Article` and allowed game IDs from Task 2.
- Produces: `ArticleMarkdown({ content }: { content: string })`, `extractArticleHeadings(content: string)`, and a directive transformer that turns only valid `play-games` containers into the renderer-owned component node.
- Used by: Task 5 preview and Task 6 detail route.

- [ ] **Step 1: Add failing tests for directives and headings**

Assert `:::play-games{games="classic mini max"}` yields a normalized `string[]` of valid game IDs; assert unknown directive names, an unknown game ID, a missing games attribute, and arbitrary attributes are invalid. Assert headings are extracted from Markdown h2/h3 text consistently with the current table of contents anchors.

- [ ] **Step 2: Run focused tests to verify they fail**

Run: `pnpm exec vitest run src/features/articles/markdown/directives.test.ts src/features/articles/markdown/headings.test.ts`

Expected: FAIL because the Markdown modules do not exist.

- [ ] **Step 3: Install renderer and directive dependencies**

Add `react-markdown`, `remark-directive`, `unist-util-visit`, and `rehype-sanitize` as runtime dependencies. Use the project lockfile command so package versions are recorded in `pnpm-lock.yaml`.

- [ ] **Step 4: Implement the directive transformer and `ArticleMarkdown`**

Run `remark-gfm`, `remark-directive`, then a local AST transformer. It must map valid directives to one internal component name and serialized safe props; it must not pass source attributes through. Configure `react-markdown` to skip raw HTML and use a restrictive sanitization schema. Map tables and links to the project's existing UI/styling; map the internal node to `PlayGames` rather than rendering user supplied HTML.

- [ ] **Step 5: Run focused tests and lint**

Run: `pnpm exec vitest run src/features/articles/markdown/directives.test.ts src/features/articles/markdown/headings.test.ts && pnpm lint`

Expected: PASS.

- [ ] **Step 6: Commit safe Markdown rendering**

```bash
git add package.json pnpm-lock.yaml src/features/articles/markdown
git commit -m "feat: render safe patch note markdown"
```

### Task 4: Add authenticated article mutations

**Files:**
- Create: `src/app/admin/patch-notes/actions.ts`
- Create: `src/app/admin/patch-notes/actions.test.ts`
- Modify: `src/app/api/admin/utils/is-allowed-admin.ts`

**Interfaces:**
- Consumes: `articleEditorSchema`, `ArticleEditorInput`, `createClient()`, `createServiceRoleClient()`, and `isAllowedAdmin()`.
- Produces: server actions `createArticle`, `updateArticle`, `changeArticleStatus`, and `deleteArticle`, returning a discriminated `{ ok: true; article: Article } | { ok: false; error: string }` result.
- Used by: Task 5 admin list/editor UI.

- [ ] **Step 1: Write failing action tests with mocked auth and service client boundaries**

Cover unauthenticated caller returns `Unauthorized`, non-allowlisted caller returns `Forbidden`, malformed payload returns field-safe validation errors, duplicate-slug database error maps to a slug error, and an allowed caller can save a draft, schedule a future article, publish, unpublish, and delete.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `pnpm exec vitest run src/app/admin/patch-notes/actions.test.ts`

Expected: FAIL because the action module does not exist.

- [ ] **Step 3: Implement `requireAllowedAdmin()` and server actions**

Extract a shared `requireAllowedAdmin()` helper next to `isAllowedAdmin()` so the admin layout, API handlers, and actions rely on one claim/allowlist rule. Each action must call it before constructing the service-role client. Convert Manila-local schedule values to UTC; set `published_at` only on the first publish; call `revalidatePath("/patch-notes")`, the affected detail path, and the admin list after success.

- [ ] **Step 4: Run action tests to verify they pass**

Run: `pnpm exec vitest run src/app/admin/patch-notes/actions.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit article mutations**

```bash
git add src/app/admin/patch-notes/actions.ts src/app/admin/patch-notes/actions.test.ts src/app/api/admin/utils/is-allowed-admin.ts
git commit -m "feat: add article admin actions"
```

### Task 5: Build the Patch Notes admin list and Tiptap editor

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `src/app/admin/page.tsx`
- Create: `src/app/admin/patch-notes/page.tsx`
- Create: `src/app/admin/patch-notes/new/page.tsx`
- Create: `src/app/admin/patch-notes/[id]/page.tsx`
- Create: `src/features/articles/editor/article-editor.tsx`
- Create: `src/features/articles/editor/article-editor-form.tsx`
- Create: `src/features/articles/editor/play-games-node.ts`
- Create: `src/features/articles/editor/article-editor.test.ts`

**Interfaces:**
- Consumes: Task 2 admin repository functions, Task 3 directive contract, and Task 4 server actions.
- Produces: `/admin/patch-notes`, `/admin/patch-notes/new`, and `/admin/patch-notes/[id]` protected by the existing admin layout.
- Used by: administrators; no public route depends on this UI.

- [ ] **Step 1: Write the failing editor round-trip test**

Using a jsdom-enabled Vitest test, initialize the configured editor from Markdown containing a GFM table and `play-games`; assert `getMarkdown()` preserves semantic table content and serializes the directive with only valid game IDs. Assert invalid directive input is surfaced as a form error rather than serialized.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `pnpm exec vitest run src/features/articles/editor/article-editor.test.ts`

Expected: FAIL because editor configuration does not exist.

- [ ] **Step 3: Install and configure Tiptap**

Add `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-task-list`, `@tiptap/extension-task-item`, `@tiptap/extension-table`, `@tiptap/extension-table-row`, `@tiptap/extension-table-cell`, `@tiptap/extension-table-header`, and `@tiptap/markdown`. Add `jsdom` as a development dependency only if the existing Vitest environment cannot provide DOM APIs.

- [ ] **Step 4: Implement the editor and admin routes**

Configure only the spec's allowed blocks. Implement `play-games` as a Tiptap node with a controlled game-ID picker and explicit Markdown parse/render functions. Do not expose an HTML/MDX source mode. The editor form owns title, editable generated slug, summary, tags, status controls, and Manila date/time input; it invokes Task 4 actions and shows returned errors. List rows display status, due/published time, and update time; add a confirmation dialog before deletion. Add a Patch Notes link/card to `src/app/admin/page.tsx`.

- [ ] **Step 5: Run the editor test and lint**

Run: `pnpm exec vitest run src/features/articles/editor/article-editor.test.ts && pnpm lint`

Expected: PASS.

- [ ] **Step 6: Commit the admin experience**

```bash
git add package.json pnpm-lock.yaml src/app/admin/page.tsx src/app/admin/patch-notes src/features/articles/editor
git commit -m "feat: add patch notes editor"
```

### Task 6: Switch public Patch Notes to articles and remove filesystem content ownership

**Files:**
- Modify: `src/app/patch-notes/page.tsx`
- Modify: `src/app/patch-notes/[slug]/page.tsx`
- Delete: `src/app/patch-notes/utils.ts`
- Delete: `src/app/patch-notes/utils.test.ts`
- Delete: `src/app/patch-notes/posts/introducing-saltong-hub.mdx`
- Delete: `src/app/patch-notes/posts/leaderboards-valentines-update.mdx`
- Delete: `src/app/patch-notes/posts/saltong-tips-and-tricks.mdx`
- Create: `src/app/patch-notes/page.test.tsx`
- Create: `src/app/patch-notes/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `listPublicArticles`, `getPublicArticleBySlug`, `ArticleMarkdown`, and `extractArticleHeadings`.
- Produces: unchanged public URLs backed exclusively by `articles`.

- [ ] **Step 1: Write failing public route tests**

Mock the article repository to assert the list renders only eligible records in descending publication order, and the detail route renders a Markdown table plus `play-games` but calls `notFound()` when the repository returns no eligible row. Include the migrated `saltong-tips-and-tricks` slug fixture.

- [ ] **Step 2: Run focused route tests to verify they fail**

Run: `pnpm exec vitest run src/app/patch-notes/page.test.tsx 'src/app/patch-notes/[slug]/page.test.tsx'`

Expected: FAIL until routes stop importing the filesystem loader.

- [ ] **Step 3: Replace filesystem reads with article repository calls**

Remove `fs`, `path`, frontmatter parsing, `generateStaticParams`, and draft-admin rendering branches from the public Patch Notes routes. Keep existing page presentation, `JsonLd`, metadata, fallback hero treatment, tags, and table of contents; map article fields to those view props. Configure a bounded `revalidate` export on list and detail pages so due scheduled posts appear without a cron. Render article bodies only through `ArticleMarkdown`.

- [ ] **Step 4: Delete the no-longer-live filesystem source and update imports**

Remove the MDX post files and `utils.ts`; retain global MDX configuration because policy pages still use `.mdx`. Confirm no references to `getBlogPosts`, `getBlogPost`, or `CustomMDX` remain in Patch Notes route code.

- [ ] **Step 5: Run public route tests, all tests, lint, and build**

Run: `pnpm exec vitest run src/app/patch-notes/page.test.tsx 'src/app/patch-notes/[slug]/page.test.tsx' && pnpm test && pnpm lint && pnpm build`

Expected: all commands pass; only Supabase content drives Patch Notes.

- [ ] **Step 6: Perform the scheduled-publish smoke test against local Supabase**

Create a scheduled test article one minute in the future through the admin UI, confirm it is not returned by anonymous list/detail queries, then confirm it appears after the due time without an action or cron. Also inspect a migrated table and `play-games` block in the browser.

- [ ] **Step 7: Commit the public cutover**

```bash
git add src/app/patch-notes
git rm src/app/patch-notes/utils.ts src/app/patch-notes/utils.test.ts src/app/patch-notes/posts/introducing-saltong-hub.mdx src/app/patch-notes/posts/leaderboards-valentines-update.mdx src/app/patch-notes/posts/saltong-tips-and-tricks.mdx
git commit -m "feat: serve patch notes from articles"
```

### Task 7: Final integration verification

**Files:**
- Modify: only files required by verified defects found in this task.

**Interfaces:**
- Consumes: all completed tasks.
- Produces: verified end-to-end editorial and public Patch Notes flow.

- [ ] **Step 1: Run migration/type generation from a clean local database**

Run: `supabase db reset && pnpm supabase:typegen && git diff --check && git diff -- src/lib/supabase/types.ts`

Expected: migration succeeds, exactly three migrated article rows exist, and generated types are current.

- [ ] **Step 2: Run the complete verification suite**

Run: `supabase test db supabase/tests/articles.test.sql && pnpm test && pnpm lint && pnpm build`

Expected: PASS.

- [ ] **Step 3: Inspect the final diff and report any deliberate deviation**

Run: `git status --short && git diff HEAD~1...HEAD --stat`

Expected: no untracked implementation artifacts; any necessary follow-up is explicitly documented rather than silently deferred.

- [ ] **Step 4: Commit only an integration fix, if verification required one**

If and only if Steps 1-3 require a code correction, stage the exact verified files and commit with `fix: complete patch notes cms integration`. Otherwise, leave this step unchecked with a note that no integration fix was necessary.

## Self-review

- **Spec coverage:** Tasks 1-2 implement the persistence, status, RLS, visibility, and validation contract; Task 3 implements safe Markdown/directive rendering; Tasks 4-5 implement protected authoring; Task 6 retains public routes and removes filesystem ownership; Task 7 verifies migrations, types, and the end-to-end scheduled flow.
- **Step scan:** Every task begins with a named failing test, supplies interfaces and precise locations, then verifies and commits a self-contained deliverable.
- **Type consistency:** `Article`, `ArticleEditorInput`, `ArticleStatus`, `ArticleMarkdown`, and the four mutation names are introduced before later tasks consume them.
- **Review Focus:** Each listed risk is assigned to Task 1, 2, 3, 4, or 5 respectively and receives an explicit test step.
- **Proportion:** The plan specifies interfaces, data invariants, and verification commands without prescribing implementation bodies beyond the SQL/policy contract that the schema requires.
