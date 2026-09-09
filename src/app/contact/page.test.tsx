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
vi.mock("@/components/ui/button", () => ({
  Button: ({ children }: { children: ReactNode }) =>
    createElement("div", null, children),
}));

import ContactPage from "./page";

describe("contact page", () => {
  it("provides direct support and collaboration channels", () => {
    const markup = renderToStaticMarkup(createElement(ContactPage));

    expect(markup).toContain("Contact Us");
    expect(markup).toContain("Found a bug?");
    expect(markup).toContain('href="mailto:hello@carldegs.com"');
    expect(markup).toContain(
      'href="https://www.linkedin.com/in/carl-justin-de-guia-b40a1b97/"'
    );
    expect(markup).not.toContain("Contact Saltong Hub");
  });
});
