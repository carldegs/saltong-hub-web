import { describe, expect, it } from "vitest";
import {
  createAuthCallbackUrl,
  createAuthConfirmationRedirectUrl,
  getAuthReturnTo,
  createPasswordRecoveryRedirectUrl,
} from "./redirects";

describe("createAuthCallbackUrl", () => {
  it("builds callback URLs with a validated return path", () => {
    expect(
      createAuthCallbackUrl("/auth/reset", "https://www.saltong.com/")
    ).toBe("https://www.saltong.com/auth/callback?returnTo=%2Fauth%2Freset");
  });

  it("uses the safe root when the requested path is an external redirect", () => {
    expect(
      createAuthCallbackUrl("//attacker.example", "https://www.saltong.com/")
    ).toBe("https://www.saltong.com/auth/callback?returnTo=%2F");
  });

  it("provides the site base for recovery templates that append auth confirmation", () => {
    expect(
      createPasswordRecoveryRedirectUrl("https://preview.saltong.com/")
    ).toBe("https://preview.saltong.com");
  });

  it("accepts the confirmation template's next parameter", () => {
    expect(
      getAuthReturnTo(new URLSearchParams("type=recovery&next=%2Fauth%2Freset"))
    ).toBe("/auth/reset");
  });

  it("removes one-time confirmation parameters after verification", () => {
    expect(
      createAuthConfirmationRedirectUrl(
        "https://preview.saltong.com/auth/confirm?token_hash=secret&type=recovery&next=%2Fauth%2Freset",
        "/auth/reset"
      ).toString()
    ).toBe("https://preview.saltong.com/auth/reset");
  });
});
