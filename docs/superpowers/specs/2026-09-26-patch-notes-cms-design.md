# Patch Notes CMS Design

**Date:** 2026-09-26  
**Status:** Approved design; implementation not yet started

## Goal

Replace file-authored Patch Notes with a small, first-party editorial workflow in Saltong Hub. Administrators can create, edit, draft, publish, unpublish, and schedule Patch Notes from the existing admin area. Readers continue to use the existing `/patch-notes` and `/patch-notes/[slug]` routes.

The system intentionally serves Patch Notes only in v1. The database table is named `articles` so a future expansion is possible without forcing a broader CMS scope today.

## Success criteria

- Administrators can manage all Patch Notes without editing repository files or deploying a content-only change.
- Posts support drafts, immediate publishing, and automatic scheduled publishing in Asia/Manila time.
- The existing public Patch Notes URLs and visual presentation continue to work.
- Database-authored content cannot execute arbitrary MDX, JSX, HTML, or JavaScript.
- The three posts on `origin/main` are migrated, including the one custom game-card block.

## Scope

### Included

- `articles` table and data migration.
- Admin list and create/edit pages under `/admin`.
- Tiptap visual editor that reads and writes a defined Markdown subset.
- Public Markdown rendering with GFM and one custom directive.
- Migration of the current three Patch Notes from `origin/main`.
- Tests for publication visibility, authorization boundaries, validation, directives, and public route behavior.

### Deferred to v2

- Media upload, browsing, selection, and Supabase Storage integration.
- Generic callouts or additional custom blocks.
- Multiple article categories, authorship roles, revisions, approvals, or collaboration.
- Scheduled side effects such as email or social-media publishing.

## Data model

Create `public.articles` with the following fields:

| Field | Type / rule | Purpose |
| --- | --- | --- |
| `id` | UUID primary key | Stable editor identity. |
| `slug` | unique, URL-safe text | Public route identity. Existing slugs are preserved. |
| `title` | non-empty text | Post heading and page metadata. |
| `summary` | non-empty text | Post list excerpt and page metadata. |
| `tags` | text array, default empty | Existing tag display. |
| `content_markdown` | non-empty text | Canonical article body. Never MDX. |
| `status` | `draft`, `scheduled`, or `published` | Editorial state. |
| `scheduled_for` | nullable timestamptz | Due time for scheduled posts, stored in UTC. |
| `published_at` | nullable timestamptz | Actual initial publication time. |
| `legacy_hero_image` | nullable text | Existing public image path only; no v1 upload UI. |
| `created_by` | UUID, nullable FK to auth user | Audit information. |
| `created_at`, `updated_at` | timestamptz | Audit information. |

The database owns public visibility. A post is publicly eligible when it is `published`, or is `scheduled` and `scheduled_for <= now()`. `scheduled_for` uses `timestamptz`; the admin UI converts to and from Asia/Manila time.

## Authorization and RLS

The existing `ADMIN_USER_IDS` allowlist remains the v1 administrator source.

- Admin pages retain their existing layout access check.
- Every article server action independently reads authenticated claims and checks the allowlist before mutation.
- Article mutations occur only in server-side code using the service-role client after that authorization check.
- RLS is enabled. No browser client receives write permission. The public read policy permits only publicly eligible articles; draft and future-scheduled posts are never exposed to anonymous reads.
- Server-side public queries use the same eligibility rule rather than relying on a sidebar link or page layout for security.

## Admin experience

Add a Patch Notes card to `/admin` linking to `/admin/patch-notes`.

The list page displays title, state, scheduled/published time, and last update. It provides a New Patch Note action. Selecting a row opens the editor.

The editor provides title, slug, summary, tags, and a Tiptap document. Slugs are initially generated from titles but remain editable; duplicate slugs return a clear validation error rather than being modified silently.

Supported editor blocks and marks:

- Paragraphs and headings.
- Bold, italic, and links.
- Ordered, unordered, and task lists.
- Block quotes and fenced code blocks.
- GFM tables.
- The custom `play-games` block.

Actions are Save draft, Schedule, Publish now, Unpublish, and Delete. Scheduling requires a future Asia/Manila date/time. Delete requires confirmation.

## Markdown contract

`content_markdown` is the portable source of truth. Tiptap loads it through its Markdown support and serializes changes back to Markdown. The exact supported Markdown is the editor block list above plus GFM syntax.

Raw HTML and MDX/JSX are disabled for database content. The application must not use `MDXRemote` or the existing `CustomMDX` component to render `content_markdown`.

Use `react-markdown` with `remark-gfm`, `remark-directive`, and a local directive transformer. Renderers use the existing typography and table components where appropriate.

The single v1 directive is:

```md
:::play-games{games="classic mini max"}
:::
```

The transformer accepts only `play-games`, permits only the known game IDs (`classic`, `mini`, `max`, and `hex`), rejects invalid attributes, and renders the application-owned game-link card group. Unknown or invalid directives are rejected by editor validation and safely omitted by the public renderer. There is no generic arbitrary-component directive.

## Public routes and caching

`/patch-notes` and `/patch-notes/[slug]` continue to be the public routes. Their existing cards, metadata, tags, table of contents, fallback hero treatment, and article layout are retained while their data source changes from filesystem MDX to `articles`.

The Patch Notes list and detail fetches use a bounded revalidation interval so a scheduled post becomes visible shortly after its due time without a cron job. Administrative editing views always retrieve current server data. A background job is not required unless future scheduling gains side effects.

## Existing-content migration

Migrate the following posts from `origin/main` into `articles`:

1. `introducing-saltong-hub`
2. `leaderboards-valentines-update`
3. `saltong-tips-and-tricks`

The migration preserves the current slugs, titles, summaries, tags, dates, author audit information when available, and existing legacy hero image paths. Convert the third post's HTML table to GFM. Replace its JSX game-card block with the `play-games` directive. Existing image syntax remains renderable, though v1 does not offer an image upload or insertion interface.

Once output parity is verified, remove the filesystem content loader and the `.mdx` post files as live sources. The project may retain its existing MDX configuration for unrelated static policy content.

## Validation and error handling

Both client and server validate:

- Required title, summary, and article body.
- URL-safe, unique slug.
- Valid tags.
- Valid allowed Markdown directive and game IDs.
- A future date/time for `scheduled` status.
- Allowed status transitions.

The server repeats all authorization and validation. Mutation failures return actionable editor messages without exposing raw database details. A failed migration or a directive that cannot be converted must fail visibly rather than silently dropping content.

## Verification

- SQL migration tests: schema constraints, RLS, and the three seed/migration fixtures.
- Unit tests: visibility predicate, slug validation, directive transformation and invalid-directive rejection.
- Route tests: anonymous readers cannot resolve drafts or future posts; eligible scheduled and published posts appear in list/detail routes.
- Admin tests: non-admin callers cannot mutate articles; authorized admins can save drafts, schedule, publish, unpublish, and delete.
- Browser-level smoke test: Tiptap content round-trips through Markdown for all supported blocks, including the play-games block.
- Run the local Supabase migration, then generate `src/lib/supabase/types.ts` via `pnpm supabase:typegen` and review the generated diff, per repository policy.

## Implementation boundaries

This design does not alter existing game administration, user/profile authorization, or unrelated MDX pages. Any new content types, media handling, roles, revisions, or directives require a follow-up design because they alter the editorial contract.
