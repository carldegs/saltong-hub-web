import { describe, expect, it } from "vitest";
import { metadata } from "./page";

describe("authentication metadata", () => {
  it("keeps the login route out of the index while preserving its canonical", () => {
    expect(metadata).toMatchObject({
      alternates: { canonical: "https://www.saltong.com/auth" },
      robots: { index: false, follow: true },
    });
  });
});
