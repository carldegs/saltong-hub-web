import { describe, expect, it } from "vitest";
import { generateMetadata, generateStaticParams } from "./page";

describe("game how-to-play pages", () => {
  it("statically generates every game guide", () => {
    expect(generateStaticParams()).toEqual([
      { game: "saltong" },
      { game: "mini" },
      { game: "max" },
      { game: "hex" },
      { game: "sudoku" },
      { game: "mathinik" },
    ]);
  });

  it("makes individual game guides canonical and indexable", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ game: "mathinik" }),
    });

    expect(metadata).toMatchObject({
      alternates: { canonical: "https://saltong.com/how-to-play/mathinik" },
      robots: { index: true, follow: true },
    });
  });
});
