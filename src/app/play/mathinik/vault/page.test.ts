import { describe, expect, it } from "vitest";
import { metadata } from "./page";

describe("Mathinik Vault metadata", () => {
  it("uses a stable noindex canonical", () => {
    expect(metadata).toMatchObject({
      alternates: {
        canonical: "https://saltong.com/play/mathinik/vault",
      },
      robots: { index: false, follow: true },
      openGraph: { url: "https://saltong.com/play/mathinik/vault" },
    });
  });
});
