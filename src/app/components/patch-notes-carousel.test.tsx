import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Article } from "@/features/articles/types";
import PatchNotesCarousel from "./patch-notes-carousel";

const posts: Article[] = Array.from({ length: 6 }, (_, index) => ({
  id: `post-${index + 1}`,
  slug: `post-${index + 1}`,
  title: `Patch note ${index + 1}`,
  summary: `Summary ${index + 1}`,
  tags: index === 0 ? ["guide", "saltong"] : [],
  contentMarkdown: "",
  status: "published",
  scheduledFor: null,
  publishedAt: "2026-09-01",
  legacyHeroImage: index === 0 ? "/patch-notes/saltong-hub-cover.jpg" : null,
  createdBy: null,
  createdAt: "2026-09-01",
  updatedAt: "2026-09-01",
}));

describe("PatchNotesCarousel", () => {
  it("links to the patch notes archive and displays only the five newest cards", () => {
    const markup = renderToStaticMarkup(<PatchNotesCarousel posts={posts} />);

    expect(markup).toContain("Patch Notes");
    expect(markup).toContain(
      "Read more about the latest changes on the hub, some explainers on how the games are made, and tips and tricks on improving your puzzle skills."
    );
    expect(markup).toContain('href="/patch-notes"');
    expect(markup).toContain('href="/patch-notes/post-1"');
    expect(markup).toContain('href="/patch-notes/post-5"');
    expect(markup).not.toContain('href="/patch-notes/post-6"');
    expect(markup).toContain('data-slot="carousel"');
    expect(markup).toContain("/patch-notes/bg.jpg");
    expect(markup).toContain("aspect-[16/10]");
    expect(markup).not.toContain("sm:basis-");
    expect(markup).toContain("lg:basis-[30rem]");
    expect(markup).toContain('<time dateTime="2026-09-01"');
    expect(markup).toContain('title="September 1, 2026"');
    expect(markup).toContain("guide");
    expect(markup).toContain("saltong");
  });
});
