# Repository Guidelines

## Supabase Types

- Do not edit `src/lib/supabase/types.ts` manually.
- Type generation should use the local Supabase schema, not the remote project. Make sure the local Supabase database is running and has the relevant migrations applied, then run:

  ```sh
  pnpm supabase:typegen
  ```

- The underlying command should stay equivalent to:

  ```sh
  npx supabase gen types typescript --local > src/lib/supabase/types.ts
  ```

- Do not switch type generation back to `supabase gen types --project-id ...`; new migrations should be type-checked locally before they are pushed.
- Review the generated diff before committing.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
