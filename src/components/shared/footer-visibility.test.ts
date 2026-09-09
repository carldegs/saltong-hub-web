import { describe, expect, it } from "vitest";
import { FOOTER_LINK_GROUPS } from "./footer-links";
import { shouldShowAppFooter } from "./footer-visibility";

describe("shouldShowAppFooter", () => {
  it("hides the footer on every playable game route", () => {
    expect(shouldShowAppFooter("/play")).toBe(false);
    expect(shouldShowAppFooter("/play/mini")).toBe(false);
    expect(shouldShowAppFooter("/play/sudoku/easy")).toBe(false);
  });

  it("shows the footer on hub and informational routes", () => {
    expect(shouldShowAppFooter("/")).toBe(true);
    expect(shouldShowAppFooter("/about")).toBe(true);
    expect(shouldShowAppFooter("/filipino-wordle")).toBe(true);
    expect(shouldShowAppFooter(null)).toBe(true);
  });

  it("groups approved internal links by purpose", () => {
    expect(FOOTER_LINK_GROUPS).toEqual([
      {
        label: "Games",
        links: [
          { href: "/play", label: "Saltong" },
          { href: "/play/mini", label: "Mini" },
          { href: "/play/max", label: "Max" },
          { href: "/play/hex", label: "Hex" },
          { href: "/play/sudoku", label: "Sudoku" },
          { href: "/play/mathinik", label: "Mathinik" },
        ],
      },
      {
        label: "Explore",
        links: [{ href: "/patch-notes", label: "Patch Notes" }],
      },
      {
        label: "Project",
        links: [
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
          { href: "/contribute", label: "Contribute" },
        ],
      },
      {
        label: "Legal",
        links: [
          { href: "/policies/privacy", label: "Privacy" },
          { href: "/policies/terms", label: "Terms" },
          { href: "/policies/cookies", label: "Cookies" },
        ],
      },
    ]);
  });
});
