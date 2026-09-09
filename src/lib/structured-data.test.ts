import { describe, expect, it } from "vitest";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  gameJsonLd,
  siteJsonLd,
} from "./structured-data";

describe("structured data", () => {
  it("describes Saltong Hub and its creator", () => {
    expect(siteJsonLd()).toMatchObject({
      "@context": "https://schema.org",
      "@graph": expect.arrayContaining([
        expect.objectContaining({
          "@type": "WebSite",
          url: "https://saltong.com/",
        }),
        expect.objectContaining({ "@type": "Person", name: "Carl de Guia" }),
      ]),
    });
  });

  it("describes each playable route as a video game", () => {
    expect(
      gameJsonLd({
        name: "Saltong Classic",
        description: "A daily Filipino word puzzle.",
        path: "/play",
      })
    ).toMatchObject({
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: "Saltong Classic",
      url: "https://saltong.com/play",
    });
  });

  it("allows non-word puzzle games to provide their own genre", () => {
    expect(
      gameJsonLd({
        name: "Sudoku",
        description: "A daily Sudoku puzzle.",
        path: "/play/sudoku",
        genre: "Puzzle game",
      })
    ).toMatchObject({ genre: "Puzzle game" });
  });

  it("describes Patch Notes as articles with breadcrumbs", () => {
    expect(
      articleJsonLd({
        title: "Saltong Tips",
        description: "Practical Saltong strategy.",
        path: "/patch-notes/saltong-tips-and-tricks",
        publishedAt: "2026-09-01",
        author: "Carl de Guia",
      })
    ).toMatchObject({
      "@type": "Article",
      headline: "Saltong Tips",
      mainEntityOfPage:
        "https://saltong.com/patch-notes/saltong-tips-and-tricks",
    });

    expect(
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Patch Notes", path: "/patch-notes" },
      ])
    ).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        expect.objectContaining({ position: 1, item: "https://saltong.com/" }),
        expect.objectContaining({
          position: 2,
          item: "https://saltong.com/patch-notes",
        }),
      ],
    });
  });
});
