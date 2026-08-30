import { describe, expect, it } from "vitest";

import { generateMetadata } from "./page";

describe("Sudoku difficulty metadata", () => {
  it("uses the stable canonical and noindex robots for a dated grid", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ difficulty: "easy" }),
      searchParams: Promise.resolve({ d: "2026-08-22" }),
    });

    expect(metadata).toMatchObject({
      alternates: {
        canonical: "https://saltong.com/play/sudoku/easy",
      },
      robots: { index: false, follow: true },
      openGraph: { url: "https://saltong.com/play/sudoku/easy" },
    });
  });
});
