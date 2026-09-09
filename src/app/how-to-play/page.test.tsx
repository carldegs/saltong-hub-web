import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/components/home-navbar-brand", () => ({
  default: () => createElement("div"),
}));
vi.mock("@/components/shared/navbar", () => ({
  Navbar: ({ children }: { children: ReactNode }) =>
    createElement("div", null, children),
}));

import HowToPlayPage, { metadata } from "./page";

describe("how to play page", () => {
  it("is canonical and indexable", () => {
    expect(metadata).toMatchObject({
      alternates: { canonical: "https://saltong.com/how-to-play" },
      robots: { index: true, follow: true },
    });
  });

  it("links to every dedicated game guide", () => {
    const markup = renderToStaticMarkup(createElement(HowToPlayPage));

    expect(markup).toContain("How to Play Saltong Hub Games");
    expect(markup).toContain('href="/how-to-play/saltong"');
    expect(markup).toContain('href="/how-to-play/mini"');
    expect(markup).toContain('href="/how-to-play/max"');
    expect(markup).toContain('href="/how-to-play/hex"');
    expect(markup).toContain('href="/how-to-play/sudoku"');
    expect(markup).toContain('href="/how-to-play/mathinik"');
  });
});
