import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("./components/daily-games-card", () => ({
  default: () => createElement("div"),
}));
vi.mock("./components/hex-games-card", () => ({
  default: () => createElement("div"),
}));
vi.mock("./components/game-card", () => ({
  default: () => createElement("div"),
}));
vi.mock("./components/home-navbar-brand", () => ({
  default: () => createElement("div"),
}));
vi.mock("@/components/banners/create-account-banner", () => ({
  default: () => createElement("div"),
}));
vi.mock("@/components/banners/numbers-games-banner", () => ({
  default: () => createElement("div"),
}));
vi.mock("@/components/shared/navbar", () => ({
  Navbar: ({ children }: { children: ReactNode }) =>
    createElement("div", null, children),
}));

import HomePage from "./page";

describe("home page SEO discovery", () => {
  it("links visitors and crawlers to the Filipino word-game landing page", async () => {
    const page = await HomePage();
    const markup = renderToStaticMarkup(page);

    expect(markup).toContain('href="/filipino-wordle"');
    expect(markup).toContain("Looking for a Filipino word game?");
  });
});
