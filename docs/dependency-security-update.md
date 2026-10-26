# Dependency security update — 26 October 2026

The npm audit went from 199 advisories (7 critical, 111 high, 66 moderate,
15 low) to zero across the installed production and development dependency
graph. This is a snapshot of known advisories, not a guarantee against future
disclosures. Deploy the updated lockfile to apply these fixes to production.

## Changes

- Next.js, MDX, third-party integrations, and Next ESLint packages: 16.4.3.
  This includes the [October framework security fixes](https://nextjs.org/blog/nextjs-security-update-october-14-2026).
- React and React DOM: 19.2.9, retaining the existing React minor release.
- Updated compatible releases of Supabase, TanStack Query, Radix, Tailwind,
  React Hook Form, OpenAI, Motion, and other libraries and build tools.
- c15t: 2.3.0, removing its old backend dependency tree. Migrated the provider,
  banner, and dialog APIs, imported its stylesheet, and removed an empty client
  wrapper and unused scripts package. Offline consent and legal links remain.
- Zod: 4.6.7. Migrated validation error access from `errors` to `issues`.
- Vitest: 4.1.12, with Vite 8.3.5 explicitly installed to avoid stale peer
  resolution. Inlined c15t's Next entry in tests so Vite resolves its Next imports.
- Scoped Webpack and WebSocket overrides require patched releases of those
  transitive dependencies. Revisit the overrides when parent packages update.
- Preserved current main's typed group-update helper and invite-code rotation,
  React test-element fixes, and optional-redirect type fixes during the rebase.
  Added action-level invitation regression coverage. Generated Supabase types
  and schema were not changed.
- Preserved current main's expanded TypeScript/TSX test discovery and password
  recovery implementation; migrated the new password-change validation to Zod 4.

## Runtime and scope

Use **Node.js 22.12 or later**, declared in `package.json`. Supabase now requires
Node 22+, and Vite requires at least 22.12 on that release line. Validation in
this checkout used Node 25.4.0 and pnpm 10.28.2.

Unrelated major migrations remain separate work: c15t 3, ESLint 10 (the installed
React lint plugin only declares support through ESLint 9), TypeScript 7,
Recharts 3, Motion 14, OpenAI 7, and other API-changing upgrades. Prettier advances
from current main's 3.9.6 range to 3.9.10. React types,
the carousel release, and the package-manager version are unchanged.

## Verification

- `pnpm install --frozen-lockfile --offline`: passed.
- `pnpm audit`: zero known vulnerabilities, including development dependencies.
- `pnpm test`: 100 tests passed across 46 files after rebasing onto current main.
- `node --test src/features/saltong/hooks/local-user-round.test.js`: 2 passed.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm lint`: passed with one advisory warning about an existing full-page
  profile redirect; no lint errors.
- `pnpm build`: passed, including static page generation. Used
  build-only placeholder OpenAI and Supabase settings because this checkout
  has no environment credentials. No real API calls were needed for the build.
- Browser checks against the production build: homepage, invalid-email error,
  consent banner and category dialog, rejection surviving reload, and Sudoku
  entry surviving reload all worked.
- An independent compatibility review found no actionable issues.

Authenticated login, database writes, and live OpenAI scoring still need checks
in an environment with working service credentials. Local tests exercise the
group update payload and validation rules without writing to a live database.
