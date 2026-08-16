import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/hex/queries/getHexRound", () => ({
  getCachedHexRound: vi.fn().mockResolvedValue({ roundId: 27 }),
}));

import { generateMetadata } from "./page";

describe("Saltong Hex metadata", () => {
  it("uses the stable canonical and noindex robots for a dated round", async () => {
    const metadata = await generateMetadata({
      searchParams: Promise.resolve({ d: "2026-08-17" }),
    });

    expect(metadata).toMatchObject({
      title: "Saltong Hex #27",
      alternates: { canonical: "https://www.saltong.com/play/hex" },
      robots: { index: false, follow: true },
      openGraph: { url: "https://www.saltong.com/play/hex" },
    });
  });
});
