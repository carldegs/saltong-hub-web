import { describe, expect, it } from "vitest";
import { createAuthCallbackUrl } from "./redirects";

describe("createAuthCallbackUrl", () => {
  it("routes recovery to the existing reset page", () => {
    expect(
      createAuthCallbackUrl("/auth/reset", "https://www.saltong.com")
    ).toBe("https://www.saltong.com/auth/callback?returnTo=%2Fauth%2Freset");
  });

  it("uses the safe root when the requested path is an external redirect", () => {
    expect(
      createAuthCallbackUrl("//attacker.example", "https://www.saltong.com/")
    ).toBe("https://www.saltong.com/auth/callback?returnTo=%2F");
  });
});
