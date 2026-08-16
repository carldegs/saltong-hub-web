import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/saltong/queries/getSaltongRound", () => ({
  getCachedSaltongRound: vi.fn().mockResolvedValue({ roundId: 42 }),
}));

import { generateSaltongMetadata } from "./generateSaltongMetadata";

describe("generateSaltongMetadata", () => {
  it.each([
    ["classic", "/play", "Saltong Classic #42"],
    ["mini", "/play/mini", "Saltong Mini #42"],
  ] as const)(
    "uses the stable canonical and noindex robots for a dated %s round",
    async (mode, path, title) => {
      const metadata = await generateSaltongMetadata({
        mode,
        searchParams: Promise.resolve({ d: "2026-08-17" }),
      });

      expect(metadata).toMatchObject({
        title,
        alternates: { canonical: `https://www.saltong.com${path}` },
        robots: { index: false, follow: true },
        openGraph: { url: `https://www.saltong.com${path}` },
      });
    }
  );
});
