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
