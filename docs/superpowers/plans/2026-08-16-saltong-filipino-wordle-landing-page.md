# Saltong Personal Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish an evergreen, personal Saltong origin page at `/filipino-wordle` that helps searchers understand the game and leads them directly to play it.

**Architecture:** A focused content module owns the approved first-person story, game overview, and independence note. A server-rendered App Router page presents that content with existing Saltong UI primitives, supplies brand-led metadata and an explicit canonical URL, and is added to the indexable sitemap.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Vitest, existing Saltong components.

## Global Constraints

- Implement this only after the technical SEO foundation plan is deployed and its public metadata is verified.
- Route: `/filipino-wordle`; canonical URL: `https://www.saltong.com/filipino-wordle`.
- Keep the title brand-led: `Saltong: A Daily Filipino Word Game`.
- The page is personal and first person; it preserves the approved COVID-era origin, 650,000-player, and 12-million-page-view facts.
- The personal history says Saltong was inspired by Wordle only on this page.
- Include: “Saltong is independently created and is not affiliated with or endorsed by Wordle or The New York Times.”
- Do not add Wordle or Spelling Bee to any game-page description.
- The page must be useful on its own, not a redirect or a thin keyword page.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `src/app/filipino-wordle/content.ts` | Owns stable personal copy and the linked game overview. |
| `src/app/filipino-wordle/content.test.ts` | Protects the approved facts, independence note, and `/play` destination. |
| `src/app/filipino-wordle/page.tsx` | Renders metadata and a server-rendered landing page with existing UI components. |
| `src/app/sitemap.ts` | Adds the public, indexable landing page after Phase 2 is deployed. |

## Task 1: Lock the approved landing-page content in a tested module

**Files:**
- Create: `src/app/filipino-wordle/content.ts`
- Create: `src/app/filipino-wordle/content.test.ts`

**Interfaces:**
- Consumes: no runtime services.
- Produces: `ORIGIN_STORY`, `INDEPENDENCE_NOTE`, and `GAME_OVERVIEW` content constants for the page.

- [ ] **Step 1: Write the failing content contract test**

```ts
// src/app/filipino-wordle/content.test.ts
import { describe, expect, it } from "vitest";
import { GAME_OVERVIEW, INDEPENDENCE_NOTE, ORIGIN_STORY } from "./content";

describe("Filipino Wordle landing content", () => {
  it("keeps Saltong's approved personal origin facts", () => {
    expect(ORIGIN_STORY.join(" ")).toContain("while I was stuck in my room during COVID");
    expect(ORIGIN_STORY.join(" ")).toContain("650,000 players");
    expect(ORIGIN_STORY.join(" ")).toContain("12 million page views");
  });

  it("states Saltong's independence clearly", () => {
    expect(INDEPENDENCE_NOTE).toBe(
      "Saltong is independently created and is not affiliated with or endorsed by Wordle or The New York Times."
    );
  });

  it("sends the primary call to action to the current Saltong game", () => {
    expect(GAME_OVERVIEW[0]).toMatchObject({ name: "Saltong", href: "/play" });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test -- src/app/filipino-wordle/content.test.ts`

Expected: FAIL because the content module does not yet exist.

- [ ] **Step 3: Implement the approved content constants**

```ts
// src/app/filipino-wordle/content.ts
export const ORIGIN_STORY = [
  "Four years ago, while I was stuck in my room during COVID, I made Saltong as a quick side project. I didn't expect it to grow into a daily habit for more than 650,000 players and reach 12 million page views from Filipinos here and abroad.",
  "Inspired by Wordle's simple daily-puzzle format, I built Saltong to make Filipino vocabulary fun to come back to every day. Saltong Hub is its new permanent home—built so the game can keep growing with the people who play it.",
] as const;

export const INDEPENDENCE_NOTE =
  "Saltong is independently created and is not affiliated with or endorsed by Wordle or The New York Times.";

export const GAME_OVERVIEW = [
  { name: "Saltong", description: "A daily Filipino word game.", href: "/play" },
  { name: "Saltong Mini", description: "A compact daily word-game variant.", href: "/play/mini" },
  { name: "Saltong Max", description: "A longer daily word-game variant.", href: "/play/max" },
  { name: "Saltong Hex", description: "A daily Filipino word-finding puzzle.", href: "/play/hex" },
] as const;
```

- [ ] **Step 4: Run the focused content test and lint**

Run: `pnpm test -- src/app/filipino-wordle/content.test.ts && pnpm lint`

Expected: PASS.

- [ ] **Step 5: Commit the content contract**

```bash
git add src/app/filipino-wordle/content.ts src/app/filipino-wordle/content.test.ts
git commit -m "test: lock Saltong landing page story"
```

## Task 2: Build the server-rendered personal landing page

**Files:**
- Create: `src/app/filipino-wordle/page.tsx`

**Interfaces:**
- Consumes: `SITE_URL`, `canonicalUrl`, `pageIndexingMetadata`, `Navbar`, `HomeNavbarBrand`, `Button`, `Card`, and the content constants from Task 1.
- Produces: an indexable `/filipino-wordle` page with a primary link to `/play`.

- [ ] **Step 1: Add a failing route build check**

Run: `pnpm build`

Expected: the build succeeds before the page exists; the expected failing condition for this task is that `curl http://localhost:3000/filipino-wordle` returns 404 when a local production server is started from that build.

- [ ] **Step 2: Implement the page with existing layout primitives**

```tsx
// src/app/filipino-wordle/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import HomeNavbarBrand from "../components/home-navbar-brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { canonicalUrl, pageIndexingMetadata } from "@/lib/seo";
import { GAME_OVERVIEW, INDEPENDENCE_NOTE, ORIGIN_STORY } from "./content";

export const metadata: Metadata = {
  title: "Saltong: A Daily Filipino Word Game",
  description: "Discover Saltong, an independent daily Filipino word game created for players here and abroad.",
  ...pageIndexingMetadata("/filipino-wordle", true),
  openGraph: {
    type: "website",
    title: "Saltong: A Daily Filipino Word Game",
    description: "Discover Saltong, an independent daily Filipino word game created for players here and abroad.",
    url: canonicalUrl("/filipino-wordle"),
  },
};

export default function FilipinoWordlePage() {
  return (
    <>
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main className="mx-auto w-full max-w-5xl space-y-12 px-4 py-12 sm:px-6">
        <section className="mx-auto max-w-3xl space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Saltong: A Daily Filipino Word Game
          </h1>
          {ORIGIN_STORY.map((paragraph) => (
            <p key={paragraph} className="text-muted-foreground text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
          <Button size="lg" asChild>
            <Link href="/play">Play Saltong</Link>
          </Button>
          <p className="text-muted-foreground text-sm">{INDEPENDENCE_NOTE}</p>
        </section>
        <section aria-labelledby="games-heading" className="space-y-6">
          <h2 id="games-heading" className="text-2xl font-semibold">
            Explore Saltong Hub
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {GAME_OVERVIEW.map((game) => (
              <Card key={game.href}>
                <CardHeader>
                  <CardTitle>{game.name}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild>
                    <Link href={game.href}>Play {game.name}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
```

Render a `Navbar` with `HomeNavbarBrand`, one semantic `h1` reading “Saltong:
A Daily Filipino Word Game”, the two `ORIGIN_STORY` paragraphs, a primary
`Button` link to `/play`, a four-card `GAME_OVERVIEW` section, and the exact
`INDEPENDENCE_NOTE` in subdued text. Use the homepage's `max-w-5xl px-4`
container convention; do not introduce new styling utilities or dependencies.

- [ ] **Step 3: Build and inspect the generated route**

Run: `pnpm lint && pnpm build`

Expected: PASS.

Run: `pnpm start`

In another terminal, run:

```bash
curl -sS http://localhost:3000/filipino-wordle | rg 'Saltong: A Daily Filipino Word Game|650,000 players|not affiliated|canonical'
```

Expected: all four strings appear in server-rendered HTML. Stop the local
server after the check.

- [ ] **Step 4: Commit the landing page**

```bash
git add src/app/filipino-wordle/page.tsx
git commit -m "feat: add Saltong origin landing page"
```

## Task 3: Add the landing page to the public sitemap

**Files:**
- Modify: `src/app/sitemap.ts:35-83`
- Modify: `src/app/sitemap.test.ts`

**Interfaces:**
- Consumes: `SITE_URL` from `src/lib/seo.ts` and the existing `sitemap()` function.
- Produces: one canonical sitemap entry for `/filipino-wordle` with no query string or vault path.

- [ ] **Step 1: Add a failing sitemap assertion**

```ts
// add to the existing mocked sitemap test in src/app/sitemap.test.ts
expect(sitemap()).toContainEqual(
  expect.objectContaining({
    url: "https://www.saltong.com/filipino-wordle",
    changeFrequency: "monthly",
    priority: 0.8,
  })
);
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test -- src/app/sitemap.test.ts`

Expected: FAIL because the landing route is absent from the sitemap.

- [ ] **Step 3: Add the canonical landing entry**

Add this static route to `routes` in `src/app/sitemap.ts`:

```ts
{
  url: `${baseUrl}/filipino-wordle`,
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.8,
},
```

Keep `baseUrl` tied to the `SITE_URL` fallback established in the technical
foundation plan.

- [ ] **Step 4: Run the suite and build**

Run: `pnpm test && pnpm lint && pnpm build`

Expected: PASS.

- [ ] **Step 5: Commit the sitemap entry**

```bash
git add src/app/sitemap.ts src/app/sitemap.test.ts
git commit -m "fix(seo): add Saltong origin page to sitemap"
```

## Task 4: Phase 2 production and Search Console verification

**Files:**
- Modify: `docs/superpowers/specs/2026-08-16-saltong-seo-foundation-design.md` only if a verified production result changes the agreed design.

**Interfaces:**
- Consumes: deployed `/filipino-wordle` HTML and sitemap entry.
- Produces: the baseline needed to assess the landing page over 4, 8, and 12 weeks.

- [ ] **Step 1: Verify the deployed landing page signals**

Run:

```bash
curl -sSIL https://www.saltong.com/filipino-wordle
curl -sS https://www.saltong.com/filipino-wordle | rg 'canonical|Saltong: A Daily Filipino Word Game|not affiliated'
curl -sS https://www.saltong.com/sitemap.xml | rg 'https://www.saltong.com/filipino-wordle'
```

Expected: HTTP 200; one self-referential canonical; the independence note in
the HTML; and exactly one sitemap entry.

- [ ] **Step 2: Request a recrawl in Search Console**

Inspect `https://www.saltong.com/filipino-wordle` in Search Console and request
indexing. Resubmit the existing sitemap only if Search Console reports a
sitemap processing issue.

- [ ] **Step 3: Record and review query performance**

At 4, 8, and 12 weeks, record impressions, clicks, and average position for
“Filipino Wordle”, “Filipino word game”, “Tagalog word game”, and Hex-related
queries. Compare each point with the Phase 1 baseline and investigate a
decline only when it persists across two reporting periods.

- [ ] **Step 4: Commit only an evidence-backed specification change**

```bash
git add docs/superpowers/specs/2026-08-16-saltong-seo-foundation-design.md
git commit -m "docs: record landing page production verification"
```
