# Search Console index-validation audit

Audited 25 August 2026. Search Console last updated the Page indexing report on 21 August; all four validation runs started and failed on 22 August.

## Executive summary

The Page indexing screen reports four failed validation runs, but they do **not** represent 55 newly broken pages. Search Console's Validation details separates the pages from the original issue into _Pending_ and _Failed_; only five URLs have been rechecked and still failed:

| Search Console reason                     | Affected | Rechecked and failed                                                   | Assessment                                                                                    |
| ----------------------------------------- | -------: | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Duplicate without user-selected canonical |       24 | `https://www.saltong.com/play/mini?contribute=1`                       | Needs a small technical check; its current canonical is correct.                              |
| Page with redirect                        |       11 | `https://saltong.com/?transfer=1`, `https://saltong.com/?contribute=1` | Expected; these correctly redirect to the `www` host. Do not validate this issue as a defect. |
| Alternate page with proper canonical tag  |        2 | `https://www.saltong.com/?contribute=1`                                | Expected; it correctly canonicalizes to `/`. Do not validate this issue as a defect.          |
| Crawled – currently not indexed           |       18 | `https://www.saltong.com/filipino-wordle`                              | Priority page: indexable and included in the sitemap, but Google has not selected it.         |

## What was opened in Search Console

### Duplicate without user-selected canonical

Search Console lists 24 parameterized/auth URLs. All but one are still pending in the old validation. The URL Google rechecked is:

```
https://www.saltong.com/play/mini?contribute=1
```

Its current public document has:

- Canonical: `https://www.saltong.com/play/mini`
- Robots: `index, follow`
- Title: `Saltong Mini #1683 | Saltong Hub`

The other examples are primarily `/auth?returnTo=...` or `/auth?signup=1&returnTo=...` URLs. They should not be indexed.

### Page with redirect

The two URLs that failed revalidation are:

```
https://saltong.com/?transfer=1
https://saltong.com/?contribute=1
```

Both now resolve at `https://www.saltong.com/` and the final document declares that URL as canonical. This is the intended host redirect, so the _Page with redirect_ exclusion is healthy.

The remaining examples are other `http`/apex-host URLs and apex URLs such as `/play/mini`, `/play/max`, `/about`, and `/contribute`.

### Alternate page with proper canonical tag

The failed revalidation URL is:

```
https://www.saltong.com/?contribute=1
```

It serves an indexable home page with the canonical `https://www.saltong.com/`. This is exactly how a non-content query parameter should be handled. The exclusion is healthy; it should not be "fixed" by making the query-string page indexable.

### Crawled – currently not indexed

The failed revalidation URL is:

```
https://www.saltong.com/filipino-wordle
```

Its current public document is indexable, uses that same absolute canonical, has a real `h1` (`Play Saltong`), and is included in the sitemap. This is therefore Google's quality/selection decision rather than a `noindex`, canonical, or sitemap defect. The other 17 examples are still pending and include dated games, auth return URLs, policy pages, patch notes, and `/contribute`.

## Root causes and recommended fixes

### 1. Make `www` the only host used by first-party links and Open Graph URLs

This is the concrete, code-level issue. The site's canonical helper and sitemap already use `https://www.saltong.com`, but many first-party URLs still use `https://saltong.com`:

- Open Graph metadata: invite, about, group, policy, contribute, Sudoku, and Mathinik pages.
- Patch-note and policy Markdown links.

Those links are a direct source of Google discovering apex URLs, which then appear under _Page with redirect_. Replace all first-party apex URLs with `https://www.saltong.com` (or, in TypeScript metadata, derive them from `canonicalUrl`). Keep the existing permanent apex → `www` redirect.

### 2. Treat auth, dated-game, and UI-state URLs as non-indexable variants

The current canonical setup is generally sound. Preserve it rather than changing the intended canonical destination. For extra robustness:

- Keep the stable canonical on game pages for `?d=...` and UI-state URLs such as `?contribute=1`.
- Keep auth and vault routes out of the sitemap and `noindex, follow` where their route policy permits.
- Do not put query-string variants in internal crawlable links.

The one duplicate example (`/play/mini?contribute=1`) currently has the expected canonical, so first confirm its server-rendered output remains the same for unauthenticated Googlebot before adding an exclusion rule. Do not broadly `noindex` all game query strings: dated games have an existing indexing policy and should retain their canonical signals.

### 3. Improve the `/filipino-wordle` page's index-selection signal

The technical signals are already correct, so the useful next moves are content and discovery rather than a metadata rewrite:

1. Add contextual internal links to `/filipino-wordle` from the home page and relevant patch notes, using descriptive Filipino/Tagalog word-game anchor text.
2. Ensure it remains in `sitemap.xml` with a meaningful, stable `lastModified` date rather than a generated current timestamp.
3. After the host-link cleanup deploys, use URL Inspection to request indexing for this one canonical URL. Do not start another bulk validation for the expected redirect/canonical exclusions.

## Proposed bounded implementation

1. Replace first-party apex-host URLs with the `www` canonical host; use the existing `canonicalUrl` helper in TypeScript metadata where practical.
2. Add a focused regression test that rejects `https://saltong.com` in public sitemap/metadata/link content (excluding historical text that must mention the old address).
3. Add one or two editorial internal links to the Filipino Wordle landing page and retain its current canonical/robots metadata.
4. Run the existing SEO/sitemap tests and inspect the generated sitemap before deployment.

After deployment, request indexing only for `https://www.saltong.com/filipino-wordle` and allow the other three issue types to remain excluded. Their status is correct.
