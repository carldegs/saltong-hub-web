# Saltong Technical SEO Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Saltong's existing public game pages consistently canonical and indexable, while excluding historical and login-gated URLs that create duplicate and soft-404 reports.

**Architecture:** A small SEO utility owns the public `www` origin, canonical URL construction, and index/noindex metadata. Existing game and vault metadata generators consume it; the sitemap contains only public, indexable routes. A permanent Next.js redirect maps the retired `/blog` route to `/patch-notes`.

**Tech Stack:** Next.js 16 App Router, TypeScript, pnpm, Vitest, ESLint.

## Global Constraints

- The only public canonical host is `https://www.saltong.com`.
- Do not change existing game titles or add Wordle or Spelling Bee to game-page descriptions.
- Saltong descriptions use “daily Filipino word game”; Mini and Max use “daily Filipino word-game variant”; Hex uses “daily Filipino word-finding puzzle”.
- A dated `?d=` game URL and every vault URL stays usable by players but is `noindex, follow`.
- Sitemap entries must be public, canonical, and indexable; omit all vault routes.
- `/blog` permanently redirects to `/patch-notes`; `/$` and `/cdn-cgi/l/email-protection` keep their existing 404 behavior.
- Do not add resilience code for the single historic vault 5xx unless it is reproducible.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `vitest.config.ts` | Runs focused TypeScript tests with the existing `@/` alias. |
| `src/lib/seo.ts` | Owns canonical URL and robots metadata helpers shared by pages. |
| `src/lib/seo.test.ts` | Locks the public origin, canonical, and noindex behavior. |
| `src/app/sitemap.test.ts` | Locks the rule that only public, indexable routes appear in the sitemap. |
| `src/lib/seo-redirects.test.ts` | Locks the retired `/blog` redirect contract. |
| `src/app/layout.tsx` | Declares `metadataBase` and the site-level public host without inheriting a root canonical into child pages. |
| `src/features/saltong/utils/generateSaltongMetadata.ts` | Adds canonical/noindex behavior and independent descriptions to classic, Mini, and Max. |
| `src/features/saltong/utils/generateSaltongVaultMetadata.ts` | Marks classic, Mini, and Max vaults noindex. |
| `src/app/play/hex/page.tsx` | Adds canonical/noindex behavior and the independent Hex description. |
| `src/app/play/hex/vault/page.tsx` | Marks the Hex vault noindex. |
| `src/app/sitemap.ts` | Lists only public indexable pages and uses the `www` origin. |
| `next.config.mjs` | Permanently redirects `/blog` to `/patch-notes`. |

## Task 1: Add a tested SEO metadata primitive

**Files:**
- Create: `vitest.config.ts`
- Create: `src/lib/seo.ts`
- Create: `src/lib/seo.test.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Produces: `SITE_URL`, `canonicalUrl(path)`, and `pageIndexingMetadata(path, indexable)` from `src/lib/seo.ts`.
- Consumes: Next.js `Metadata` type only; no request, cookie, or database state.

- [ ] **Step 1: Write the failing metadata tests**

```ts
// src/lib/seo.test.ts
import { describe, expect, it } from "vitest";
import { SITE_URL, canonicalUrl, pageIndexingMetadata } from "./seo";

describe("SEO metadata", () => {
  it("uses the www host for public canonical URLs", () => {
    expect(SITE_URL).toBe("https://www.saltong.com");
    expect(canonicalUrl("/play/mini")).toBe(
      "https://www.saltong.com/play/mini"
    );
  });

  it("keeps canonical pages indexable", () => {
    expect(pageIndexingMetadata("/play", true)).toEqual({
      alternates: { canonical: "https://www.saltong.com/play" },
      robots: { index: true, follow: true },
    });
  });

  it("prevents historical or gated pages from being indexed", () => {
    expect(pageIndexingMetadata("/play/mini", false)).toEqual({
      alternates: { canonical: "https://www.saltong.com/play/mini" },
      robots: { index: false, follow: true },
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run src/lib/seo.test.ts`

Expected: FAIL because Vitest and `src/lib/seo.ts` do not yet exist.

- [ ] **Step 3: Add Vitest and the minimal helper**

Run: `pnpm add -D vitest`

```ts
// vitest.config.ts
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vitest/config";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: { alias: { "@": resolve(rootDir, "src") } },
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
```

```ts
// src/lib/seo.ts
import type { Metadata } from "next";

export const SITE_URL = "https://www.saltong.com";

export function canonicalUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function pageIndexingMetadata(
  path: string,
  indexable: boolean
): Pick<Metadata, "alternates" | "robots"> {
  return {
    alternates: { canonical: canonicalUrl(path) },
    robots: { index: indexable, follow: true },
  };
}
```

Add `"test": "vitest run"` to `package.json` scripts.

- [ ] **Step 4: Run the focused test and lint**

Run: `pnpm test -- src/lib/seo.test.ts`

Expected: PASS with three assertions.

Run: `pnpm lint`

Expected: PASS with no new lint errors.

- [ ] **Step 5: Commit the test foundation**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts src/lib/seo.ts src/lib/seo.test.ts
git commit -m "test: add SEO metadata coverage"
```

## Task 2: Canonicalize public game metadata and noindex dated routes

**Files:**
- Create: `src/features/saltong/utils/game-seo.ts`
- Create: `src/features/saltong/utils/game-seo.test.ts`
- Modify: `src/app/layout.tsx:25-54`
- Modify: `src/app/page.tsx:14-27`
- Modify: `src/features/saltong/utils/generateSaltongMetadata.ts:11-46`
- Modify: `src/app/play/hex/page.tsx:20-53`

**Interfaces:**
- Consumes: `pageIndexingMetadata(path, indexable)` from `src/lib/seo.ts`.
- Produces: `getSaltongGameSeo(mode, dated)` with `{ path, description, indexing }` for `classic`, `mini`, and `max`.
- Produces: a Hex metadata branch that uses `pageIndexingMetadata("/play/hex", !Boolean(searchParams.d))`.

- [ ] **Step 1: Write failing tests for the game SEO mapping**

```ts
// src/features/saltong/utils/game-seo.test.ts
import { describe, expect, it } from "vitest";
import { getSaltongGameSeo } from "./game-seo";

describe("Saltong game SEO", () => {
  it("uses a distinct public route and independent description per mode", () => {
    expect(getSaltongGameSeo("classic", false)).toMatchObject({
      path: "/play",
      description: "Play Saltong, a daily Filipino word game.",
    });
    expect(getSaltongGameSeo("mini", false)).toMatchObject({
      path: "/play/mini",
      description: "Play Saltong Mini, a daily Filipino word-game variant.",
    });
    expect(getSaltongGameSeo("max", false)).toMatchObject({
      path: "/play/max",
      description: "Play Saltong Max, a daily Filipino word-game variant.",
    });
  });

  it("marks dated game URLs noindex", () => {
    expect(getSaltongGameSeo("mini", true).indexing.robots).toEqual({
      index: false,
      follow: true,
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test -- src/features/saltong/utils/game-seo.test.ts`

Expected: FAIL because `game-seo.ts` does not exist.

- [ ] **Step 3: Implement the mapping and wire metadata consumers**

```ts
// src/features/saltong/utils/game-seo.ts
import type { SaltongMode } from "../types";
import { pageIndexingMetadata } from "@/lib/seo";

const GAME_SEO = {
  classic: { path: "/play", description: "Play Saltong, a daily Filipino word game." },
  mini: { path: "/play/mini", description: "Play Saltong Mini, a daily Filipino word-game variant." },
  max: { path: "/play/max", description: "Play Saltong Max, a daily Filipino word-game variant." },
} satisfies Record<SaltongMode, { path: string; description: string }>;

export function getSaltongGameSeo(mode: SaltongMode, dated: boolean) {
  const game = GAME_SEO[mode];
  return { ...game, indexing: pageIndexingMetadata(game.path, !dated) };
}
```

In `generateSaltongMetadata`, call `getSaltongGameSeo(mode, Boolean(params.d))` once. Spread `indexing` into both the no-round and round metadata objects, use `description` for the page description, and use `canonicalUrl(path)` for `openGraph.url`. Preserve the existing dynamic round title.

In Hex metadata, use the description `Play Saltong Hex, a daily Filipino word-finding puzzle.`, spread `pageIndexingMetadata("/play/hex", !Boolean(searchParams.d))`, and replace the non-`www` Open Graph URL with `canonicalUrl("/play/hex")`.

In `src/app/layout.tsx`, add `metadataBase: new URL(SITE_URL)` and use `SITE_URL` for the root Open Graph URL. Do not add `alternates.canonical` in the layout because child routes would inherit the root canonical. In `src/app/page.tsx`, spread `pageIndexingMetadata("/", true)` into the homepage metadata and apply a concise, independent Filipino-word-game description.

- [ ] **Step 4: Run focused tests, lint, and production build**

Run: `pnpm test -- src/lib/seo.test.ts src/features/saltong/utils/game-seo.test.ts`

Expected: PASS with five assertions.

Run: `pnpm lint`

Expected: PASS.

Run: `pnpm build`

Expected: PASS and all metadata routes compile without a Next.js metadata error.

- [ ] **Step 5: Commit public game metadata**

```bash
git add src/app/layout.tsx src/app/page.tsx src/app/play/hex/page.tsx src/features/saltong/utils/generateSaltongMetadata.ts src/features/saltong/utils/game-seo.ts src/features/saltong/utils/game-seo.test.ts
git commit -m "fix(seo): canonicalize public game metadata"
```

## Task 3: Remove gated vaults from indexing and the sitemap

**Files:**
- Modify: `src/features/saltong/utils/generateSaltongVaultMetadata.ts:9-33`
- Modify: `src/app/play/hex/vault/page.tsx:12-22`
- Modify: `src/app/sitemap.ts:9-83`
- Create: `src/app/sitemap.test.ts`

**Interfaces:**
- Consumes: `pageIndexingMetadata` and `canonicalUrl` from `src/lib/seo.ts`.
- Produces: noindex vault metadata and a sitemap with no `/vault` path.

- [ ] **Step 1: Write the failing sitemap/noindex tests**

```ts
// add to src/lib/seo.test.ts
it("marks a vault route noindex while retaining its canonical destination", () => {
  expect(pageIndexingMetadata("/play/mini/vault", false)).toEqual({
    alternates: {
      canonical: "https://www.saltong.com/play/mini/vault",
    },
    robots: { index: false, follow: true },
  });
});
```

Add this sitemap integration test. It mocks `getBlogPosts` so the test does not
read the filesystem or Supabase.

```ts
// src/app/sitemap.test.ts
import { describe, expect, it, vi } from "vitest";

vi.mock("./patch-notes/utils", () => ({ getBlogPosts: () => [] }));

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("does not submit login-gated vault routes", () => {
    expect(sitemap().some((entry) => entry.url.includes("/vault"))).toBe(false);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test -- src/lib/seo.test.ts src/app/sitemap.test.ts`

Expected: the noindex assertion PASSES because the helper already supports it;
the sitemap test FAILS until `vaultPages` is removed.

- [ ] **Step 3: Apply noindex metadata and simplify the sitemap**

For classic, Mini, and Max vault metadata, spread
`pageIndexingMetadata(path, false)` and use `canonicalUrl(path)` as
`openGraph.url`. In `src/app/play/hex/vault/page.tsx`, add the equivalent
`alternates`, `robots`, and canonical Open Graph URL to its static metadata.

Delete the `vaultPages` array in `src/app/sitemap.ts` and remove it from the
returned list. Replace the environment-dependent `baseUrl` declaration with
`const baseUrl = SITE_URL`; the submitted sitemap must never fall back to or
switch to the apex host.

- [ ] **Step 4: Run tests, lint, and build**

Run: `pnpm test -- src/lib/seo.test.ts src/app/sitemap.test.ts`

Expected: PASS, including the no-vault sitemap assertion.

Run: `pnpm lint && pnpm build`

Expected: both commands PASS.

- [ ] **Step 5: Commit vault indexing fixes**

```bash
git add src/features/saltong/utils/generateSaltongVaultMetadata.ts src/app/play/hex/vault/page.tsx src/app/sitemap.ts src/lib/seo.test.ts src/app/sitemap.test.ts
git commit -m "fix(seo): exclude gated vault pages from indexing"
```

## Task 4: Redirect the retired blog route and verify route behavior

**Files:**
- Modify: `next.config.mjs:6-51`
- Create: `src/lib/seo-redirects.test.ts`

**Interfaces:**
- Produces: a permanent `GET /blog` redirect to `/patch-notes`.
- Preserves: Next.js default 404 behavior for all other unknown routes.

- [ ] **Step 1: Add the redirect contract test**

```ts
// src/lib/seo-redirects.test.ts
import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config.mjs";

describe("SEO redirects", () => {
  it("permanently redirects the retired blog route", async () => {
    await expect(nextConfig.redirects()).resolves.toContainEqual({
      source: "/blog",
      destination: "/patch-notes",
      permanent: true,
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test -- src/lib/seo-redirects.test.ts`

Expected: FAIL because `redirects` is absent.

- [ ] **Step 3: Add the permanent redirect**

Add this method alongside `headers()` in `next.config.mjs`:

```js
async redirects() {
  return [
    {
      source: "/blog",
      destination: "/patch-notes",
      permanent: true,
    },
  ];
},
```

- [ ] **Step 4: Verify configuration and built routes**

Run: `pnpm test -- src/lib/seo-redirects.test.ts && pnpm lint && pnpm build`

Expected: PASS.

After deployment, run these read-only checks:

```bash
curl -sSIL https://www.saltong.com/blog
curl -sS -o /dev/null -w '%{http_code}\n' 'https://www.saltong.com/play/mini?d=2026-03-30'
curl -sS -o /dev/null -w '%{http_code}\n' 'https://www.saltong.com/$'
curl -sS -o /dev/null -w '%{http_code}\n' 'https://www.saltong.com/cdn-cgi/l/email-protection'
```

Expected: `/blog` is a permanent redirect, dated Mini remains HTTP 200 with a
`noindex` robots tag, and the two unrelated paths remain HTTP 404.

- [ ] **Step 5: Commit the redirect**

```bash
git add next.config.mjs src/lib/seo-redirects.test.ts
git commit -m "fix(seo): redirect retired blog route"
```

## Task 5: Search Console handoff after Phase 1 deployment

**Files:**
- Modify: `docs/superpowers/specs/2026-08-16-saltong-seo-foundation-design.md` only if production behavior differs from this plan.

**Interfaces:**
- Consumes: the deployed sitemap and public metadata.
- Produces: an evidence-backed Search Console baseline for Phase 2.

- [ ] **Step 1: Verify the deployed sitemap contains only canonical public URLs**

Run: `curl -sS https://www.saltong.com/sitemap.xml`

Expected: `www` URLs; `/play`, `/play/mini`, `/play/max`, and `/play/hex`
exist; no URL contains `/vault`.

- [ ] **Step 2: Inspect canonical and robots metadata on representative routes**

Run:

```bash
curl -sS https://www.saltong.com/play | rg 'canonical|description|robots'
curl -sS 'https://www.saltong.com/play/mini?d=2026-03-30' | rg 'canonical|robots'
curl -sS https://www.saltong.com/play/mini/vault | rg 'canonical|robots'
```

Expected: the canonical routes are indexable; the dated and vault routes have
`noindex,follow`.

- [ ] **Step 3: Request Google recrawls**

In Search Console, inspect `https://www.saltong.com/play` and submit a request
for indexing. Resubmit `https://www.saltong.com/sitemap.xml`; do not submit
dated or vault routes.

- [ ] **Step 4: Record the baseline**

Record the current impressions, clicks, and average position for “Filipino
Wordle”, “Filipino word game”, “Tagalog word game”, and Hex-related searches.
Use this baseline to evaluate Phase 2 at 4, 8, and 12 weeks.

- [ ] **Step 5: Commit only if the specification changed**

If a verified production result requires an agreed specification correction:

```bash
git add docs/superpowers/specs/2026-08-16-saltong-seo-foundation-design.md
git commit -m "docs: record SEO production verification"
```
