import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const PUBLIC_SOURCE_FILES = [
  "src/lib/seo.ts",
  "src/app/about/page.tsx",
  "src/app/contribute/layout.tsx",
  "src/app/groups/page.tsx",
  "src/app/groups/create/page.tsx",
  "src/app/groups/[groupId]/page.tsx",
  "src/app/j/[inviteCode]/page.tsx",
  "src/app/u/[userId]/page.tsx",
  "src/app/policies/page.tsx",
  "src/app/play/sudoku/page.tsx",
  "src/app/play/sudoku/vault/page.tsx",
  "src/app/play/mathinik/vault/page.tsx",
  "src/app/patch-notes/posts/introducing-saltong-hub.mdx",
  "src/app/patch-notes/posts/leaderboards-valentines-update.mdx",
  "src/app/policies/cookies/page.mdx",
  "src/app/policies/privacy/page.mdx",
] as const;

describe("public SEO host references", () => {
  it.each(PUBLIC_SOURCE_FILES)("does not use the www host in %s", (file) => {
    const source = readFileSync(resolve(process.cwd(), file), "utf8");

    expect(source).not.toContain("https://www.saltong.com");
  });
});
