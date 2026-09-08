# AdSense Content Remediation Plan

**Date:** September 7, 2026  
**Planning baseline:** `origin/main` at `c0d413c` (`Codex/seo foundation pr (#63)`)  
**Purpose:** Prepare Saltong Hub for a successful Google AdSense site review by making it demonstrably useful, crawlable, trustworthy, and free of premature ad inventory.

## Scope and baseline

This worktree is detached at `2fb7f12`, which predates the current `origin/main` SEO foundation work. Implementation should begin from the latest mainline baseline, not from this detached checkout.

The current mainline already includes meaningful improvements:

- Canonical URL and indexing metadata helpers.
- A public `/filipino-wordle` landing page.
- A public footer on non-game routes.aw- Structured data is not implemented.

## Phase 0: Confirm the release and crawler baseline

### Objective

Ensure that the code, deployment, canonical host, and crawler behavior all agree before making content changes.

### Work

1. Confirm the deployed commit and use `origin/main` as the implementation starting point.
2. Confirm that `https://saltong.com` is the single canonical host. Do not reintroduce the earlier `www` strategy documented in the August 2026 audit.
3. Inspect the canonical homepage, `/filipino-wordle`, `/play`, `/play/mini`, `/play/max`, `/play/hex`, `robots.txt`, and `sitemap.xml` with Search Console URL Inspection or a Googlebot-compatible crawler.
4. Verify Cloudflare or hosting security rules allow verified Googlebot and AdSense crawlers to access public pages without a challenge.
5. Confirm Auto Ads are disabled in the AdSense console.

### Acceptance criteria

- The deployed canonical host is unambiguous.
- Public pages are accessible to Googlebot and AdSense crawlers.
- Sitemap and canonical URLs use the same host.
- Auto Ads are confirmed off.

## Phase 3: Prepare a safe AdSense review-code placement

### Objective

Meet the AdSense review-code requirement without creating ad inventory before approval.

### Work

1. Keep Auto Ads disabled.
2. Do not create a manual display, in-article, or other ad unit before the site is approved.
3. Do not add an ad-slot environment variable before approval.
4. After `/filipino-wordle` has been strengthened in Phase 2, remove the unconditional AdSense script from the root layout and load the review code only on `/filipino-wordle`.
5. Keep the review code off the homepage, all game routes, Patch Notes, auth, settings, profiles, groups, invitations, vaults, policies, contribution pages, errors, and redirects.

### Acceptance criteria

- Auto Ads remain disabled.
- No manual ad unit or ad-slot ID exists in the application.
- The review code appears only on the selected public editorial page after its content meets the Phase 2 standard.
- No private, utility, thin, or game route has review code or ad inventory.

## Phase 1: Skipped - no editorial guide expansion

### Objective

Keep the four core Saltong routes focused only on gameplay. Do not add new long-form guides as part of this remediation work.

### Target routes

- `/play` - Saltong Classic
- `/play/mini` - Saltong Mini
- `/play/max` - Saltong Max
- `/play/hex` - Saltong Hex

### Work

Do not add copy, disclosures, links, or other new content below or alongside the game interface. Keep the existing in-game how-to modal solely for players; it is not an editorial or crawler surface.

### Implementation notes

- Retain the existing `Saltong Tips and Tricks` article and release notes only.
- Reassess new editorial guides later as a separate content project, not an AdSense-review prerequisite.

### Acceptance criteria

- No game play screen changes visually or structurally.
- No new Patch Notes guides are added in this phase.

## Phase 2: Strengthen the homepage and Filipino Wordle landing page

### Objective

Give visitors and crawlers a clear explanation of Saltong Hub's editorial purpose and game collection.

### Homepage work

Keep the current card-driven game selection, then add a substantial server-rendered editorial section explaining:

- What Saltong Hub is.
- Who the games are for.
- Why Filipino word games are distinct.
- How Saltong, Mini, Max, Hex, Sudoku, and Mathinik differ.
- Daily puzzle cadence, accounts, vault access, and groups.
- Where to find game strategy articles and editorial updates.

### `/filipino-wordle` work

Expand the page into the primary evergreen discovery page for "Filipino Wordle" and "Tagalog word game" intent.

It should cover:

- How Saltong relates to the familiar daily word-puzzle format while remaining independent.
- The project history and creator perspective.
- How the four Filipino word-game modes differ.
- Clear links into playable routes and relevant Patch Notes articles.
- A concise explanation of word selection and community feedback.

### Acceptance criteria

- Homepage has useful, non-repetitive explanatory content in server-rendered HTML.
- `/filipino-wordle` is a substantive evergreen page with descriptive internal links.
- Both pages link to core games, Patch Notes, About, and the relevant trust pages.

## Phase 4: Establish Patch Notes as the editorial library

### Objective

Build an editorial library that demonstrates original value beyond the game UI while retaining the existing Patch Notes route and MDX infrastructure.

### Work

1. Keep `/patch-notes` as the editorial home for both release updates and evergreen game articles.
2. Give the Patch Notes index a clear "Updates and Guides" editorial description and a visible way to distinguish guide articles from release announcements.
3. Retain and prominently link the existing `Saltong Tips and Tricks` article.
4. Publish at least these six original evergreen Patch Notes articles:
   - How to Play Saltong
   - Saltong Classic vs Mini vs Max
   - How Saltong Hex Works
   - Filipino Word Game Strategy
   - Common Filipino Word Patterns for Puzzle Players
   - Daily Word Puzzles and Vocabulary Practice
5. Give every article an author, published and updated dates, related-guide links, and relevant play links.

### Content standards

- Prefer specific examples, game mechanics, and Filipino language insight over generic word-puzzle copy.
- Cite or attribute factual language claims where appropriate.
- Avoid creating articles that differ only in title or repeat a game page verbatim.
- Aim for useful long-form content, generally 700-1,200 words when the topic warrants it.

### Acceptance criteria

- `/patch-notes` is indexed, navigable, and linked from the homepage and footer.
- At least six substantial evergreen articles are public alongside release announcements.
- Each evergreen article has an editorial purpose distinct from the other Patch Notes content.

## Phase 5: Complete trust and navigation signals

### Objective

Make the site clearly identifiable as a maintained publisher project with accessible contact and policy information.

### Work

1. Expand About with:
   - Creator identity and project history.
   - Editorial goals.
   - Word-source and word-review approach.
   - Community contribution and correction process.
   - Maintenance and contact process.
2. Fix active-domain references in Terms from `saltong.carldegs.com` to `saltong.com`.
3. Update the footer to link directly to:
   - About
   - Patch Notes
   - Contact
   - Privacy Policy
   - Terms
   - Cookie Policy
   - Patch Notes

### Acceptance criteria

- A visitor can reach contact and all policies from the homepage, editorial pages, and footer.
- About clearly explains ownership, editorial process, and maintenance.
- Active legal documents identify the correct domain.

## Phase 6: Add structured data and crawler controls

### Objective

Help search engines understand the site and keep their crawl budget focused on public content.

### Work

1. Add `src/app/robots.ts` with public crawl allowance and sitemap reference.
2. Add structured data:
   - `WebSite` and `Organization` or `Person` on the homepage.
   - `VideoGame` or `SoftwareApplication` on playable game pages.
   - `FAQPage` where public FAQs appear.
   - `Article` and `BreadcrumbList` on evergreen Patch Notes articles.
   - `BreadcrumbList` on policy and Patch Notes content where useful.
3. Ensure the sitemap includes `/patch-notes` and all Patch Notes articles using stable `lastModified` values.
4. Keep vaults, auth routes, private groups, profiles, and utility/query variants out of the sitemap.

### Acceptance criteria

- `robots.txt` is generated and references the sitemap.
- Structured-data markup validates for the homepage, one core game, and one evergreen Patch Notes article.
- Sitemap contains all public evergreen content and no login-gated content.

## Phase 7: Verify and resubmit

### Objective

Validate the implementation and give Google time to crawl the improved content before requesting another review.

### Automated checks

Add or extend tests for:

- Canonical host consistency.
- Sitemap exclusion of gated and thin routes.
- Presence and validity of `robots.txt`.
- Correct canonical/noindex behavior for dated and utility query variants.
- Server-rendered game-page instructional content.
- Footer and Patch Notes links in initial HTML.
- No manual ad unit anywhere before approval; review code only on the selected content page.
- Structured data on homepage, game, and Patch Notes article pages.

### Manual checks

1. Run the full test suite and production build.
2. Inspect rendered HTML with JavaScript disabled or through a text-only fetch.
3. Validate structured data.
4. Submit the sitemap in Search Console.
5. Request indexing only for the canonical homepage, `/filipino-wordle`, `/patch-notes`, and the first evergreen articles.
6. Wait for indexing and crawl activity before requesting another AdSense review.

### Resubmission criteria

- Core public pages are accessible to Googlebot and AdSense crawlers.
- The homepage, `/filipino-wordle`, and Patch Notes library provide the site's substantial server-rendered editorial content.
- Patch Notes contains at least six original evergreen articles and is internally linked.
- No manual ad inventory is present before approval; the review code is limited to the selected public editorial page.
- Trust pages, footer links, sitemap, robots, and structured data are complete.

## Recommended implementation order

1. Phase 0 - Release and crawler baseline.
2. Phase 1 - Editorial game-help content, without gameplay changes.
3. Phase 2 - Homepage and Filipino Wordle expansion.
4. Phase 3 - Review-code placement.
5. Phase 4 - Patch Notes editorial library.
6. Phase 5 - Trust and navigation.
7. Phase 6 - Structured data and crawler controls.
8. Phase 7 - Validation, indexing, and AdSense resubmission.

## Open decisions to resolve during review

- Which commit and host are currently deployed?
- Which specific `/filipino-wordle` content standard should be met before placing the review code there?
- How should the Patch Notes index distinguish evergreen guides from release announcements?
- What documented word-source and review process can we state accurately on the About and game-guide pages?
- After approval, which Patch Notes articles meet the threshold for a single manual in-article ad unit?
