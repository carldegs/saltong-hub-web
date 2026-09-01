import { describe, expect, it } from "vitest";
import { FOOTER_LINKS } from "./footer-links";
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

  it("uses only the approved internal navigation links", () => {
    expect(FOOTER_LINKS).toEqual([
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/patch-notes", label: "Patch Notes" },
      { href: "/contribute", label: "Contribute" },
      { href: "/policies", label: "Policies" },
    ]);
  });
});
