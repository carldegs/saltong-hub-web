# Saltong SEO Foundation and Landing Page Design

**Date:** 2026-08-16  
**Status:** Approved design — pending specification review  
**Owner:** Saltong Hub

## Goal

Give Saltong a credible path to a top-three Google result for the query
"Filipino Wordle" while preserving Saltong's independent identity and keeping
the game UI unchanged. The work is delivered in two deliberate, independently
deployable phases:

1. Repair the site's canonical and indexing signals, and improve its existing
   game descriptions without using third-party game names.
2. Publish an evergreen, personal landing page at `/filipino-wordle` that
   tells Saltong's story, explains the product, and links players into the
   game.

Top-three placement is a target, not a guarantee. Google decides rankings; the
technical work, useful page content, Search Console follow-up, and future
organic mentions together improve the likelihood of reaching it.

## Constraints and Decisions

- The canonical public host is `https://www.saltong.com`.
- Existing game titles and the visual game experience remain unchanged.
- Game-page descriptions must not include the terms "Wordle" or "Spelling
  Bee".
- The exact-word-match route is `/filipino-wordle`; its title remains brand-led
  rather than keyword-led.
- The landing page says that Saltong was inspired by Wordle only in its factual,
  personal history section. It must clearly state that Saltong is
  independently created and is not affiliated with or endorsed by Wordle or
  The New York Times.
- This copy is a product/editorial decision, not legal advice. The owner may
  obtain legal review before publishing it.
- Each phase is implemented, deployed, and verified separately.

## Search Console Findings

The exported report lists category totals, and the supplied URL examples allow
the following dispositions:

| Finding | Disposition |
| --- | --- |
| 26 duplicate URLs without a user-selected canonical | Fix through one explicit `www` canonical for public pages. |
| 11 redirects | Expected for old apex-domain URLs; keep the apex-to-`www` redirect and ensure all owned signals use `www`. |
| Past dated game URLs reported as soft 404s | Keep their player login flow, but emit `noindex, follow` and canonicalize to their base game route. |
| `/blog` 404 | Permanently redirect to `/patch-notes`, the closest successor. |
| `/$` and `/cdn-cgi/l/email-protection` 404s | Keep as real 404s; they have no meaningful Saltong replacement. |
| `/play/mini/vault` 5xx | It currently returns 200, so treat the one report as transient and investigate only if it repeats. |
| Vault pages in the sitemap | Remove them and mark them `noindex`, because logged-out Googlebot sees only an authentication screen. |

## Phase 1: Technical SEO Foundation

### Canonical public pages

These are the indexable, canonical game URLs:

- `/`
- `/play`
- `/play/mini`
- `/play/max`
- `/play/hex`

Root metadata, page metadata, Open Graph URLs, and sitemap entries use the
`https://www.saltong.com` origin. Public pages receive explicit
self-referential canonical URLs instead of relying on Google to infer them.

### Game descriptions

Keep the title of every game as it is. Replace only the existing descriptions
with unique, independent descriptions that accurately describe each game:

- Saltong: a daily Filipino word game.
- Saltong Mini and Saltong Max: daily Filipino word-game variants.
- Saltong Hex: a daily Filipino word-finding puzzle.

Descriptions must remain human-readable and must not contain strings of search
keywords or references to Wordle or Spelling Bee.

### Dated and login-gated URLs

Any game URL with a `d` date query parameter stays functional for authenticated
players. For search engines it has:

- `robots: noindex, follow`
- a canonical URL equal to the query-free game route for that mode

This prevents the public login-required state from being indexed as a soft 404
while preserving its intended player flow.

Vault pages stay usable but are not search destinations. Each vault route has
`noindex, follow` and is removed from `sitemap.xml`.

### Redirects and errors

- Add a permanent redirect from `/blog` to `/patch-notes`.
- Retain correct 404 behavior for malformed and infrastructure-probe URLs.
- Do not add a speculative application change for the single historic vault
  5xx. Verify it during release checks and create a separate debugging task if
  it recurs.

## Phase 2: `/filipino-wordle` Landing Page

### Purpose and route behavior

`/filipino-wordle` is a permanent, indexable page and a first-class sitemap
entry. It has a self-referential canonical URL and a brand-led title such as
"Saltong: A Daily Filipino Word Game." It is not a redirect, a duplicate game
page, or a thin keyword page.

### Page content

The page presents a concise personal story in first person, followed by a
prominent link to `/play` and a compact overview of Saltong, Mini, Max, and
Hex. The proposed story is:

> Four years ago, while I was stuck in my room during COVID, I made Saltong as
> a quick side project. I didn't expect it to grow into a daily habit for more
> than 650,000 players and reach 12 million page views from Filipinos here and
> abroad.
>
> Inspired by Wordle's simple daily-puzzle format, I built Saltong to make
> Filipino vocabulary fun to come back to every day. Saltong Hub is its new
> permanent home—built so the game can keep growing with the people who play
> it.

The page includes a nearby, plain independence note:

> Saltong is independently created and is not affiliated with or endorsed by
> Wordle or The New York Times.

The origin metrics and COVID-era origin are sourced from the owner's public
[Saltong Hub announcement](https://www.linkedin.com/posts/carldegs_introducing-saltong-hub-activity-7397057343076757504-wYut).

## Verification

### Automated checks

- Assert that the canonical host and URL are correct for each public route.
- Assert that dated game URLs and vault pages emit `noindex`.
- Assert that the sitemap lists only intended public, indexable URLs and
  includes `/filipino-wordle` only after Phase 2.
- Assert that `/blog` redirects and the known malformed URLs remain 404.

### Production checks

After each phase deploys:

1. Fetch the relevant pages and verify their HTTP status, canonical link, and
   robots metadata.
2. Inspect `/play` in Google Search Console after Phase 1 and
   `/filipino-wordle` after Phase 2, then request a recrawl.
3. Monitor Search Console queries for "Filipino Wordle", "Filipino word game",
   "Tagalog word game", and Hex-related searches for 4, 8, and 12 weeks.
4. Reinvestigate the vault route if a 5xx is reported again.

## Out of Scope

- Changing game names, page titles, or the game UI to target search terms.
- Claiming affiliation with Wordle, Spelling Bee, or The New York Times.
- Buying links, keyword stuffing, or publishing thin supporting pages.
- Fixing hypothetical server errors that cannot be reproduced.
