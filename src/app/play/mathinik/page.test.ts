import { describe, expect, it } from "vitest";

import { generateMetadata } from "./page";

describe("Mathinik metadata", () => {
  it("uses the stable canonical and noindex robots for a dated round", async () => {
    const metadata = await generateMetadata({
      searchParams: Promise.resolve({ d: "2026-08-22" }),
    });

    expect(metadata).toMatchObject({
      alternates: { canonical: "https://saltong.com/play/mathinik" },
      robots: { index: false, follow: true },
      openGraph: { url: "https://saltong.com/play/mathinik" },
    });
  });
});
