import { describe, expect, it, vi } from "vitest";
import {
  signOutAfterPasswordChange,
  type PasswordChangeSignOutClient,
} from "./sign-out-after-password-change";

function createClient(
  signOut: PasswordChangeSignOutClient["auth"]["signOut"]
): PasswordChangeSignOutClient {
  return { auth: { signOut } };
}

describe("signOutAfterPasswordChange", () => {
  it("uses global sign-out when it succeeds", async () => {
    const signOut = vi
      .fn<PasswordChangeSignOutClient["auth"]["signOut"]>()
      .mockResolvedValue({ error: null });

    await expect(
      signOutAfterPasswordChange(createClient(signOut))
    ).resolves.toEqual({
      localSessionCleared: true,
      globalRevocationFailed: false,
    });

    expect(signOut).toHaveBeenCalledTimes(1);
    expect(signOut).toHaveBeenCalledWith({ scope: "global" });
  });

  it("clears the local session when global sign-out fails", async () => {
    const signOut = vi
      .fn<PasswordChangeSignOutClient["auth"]["signOut"]>()
      .mockResolvedValueOnce({ error: { message: "Network unavailable" } })
      .mockResolvedValueOnce({ error: null });

    await expect(
      signOutAfterPasswordChange(createClient(signOut))
    ).resolves.toEqual({
      localSessionCleared: true,
      globalRevocationFailed: true,
    });

    expect(signOut).toHaveBeenNthCalledWith(1, { scope: "global" });
    expect(signOut).toHaveBeenNthCalledWith(2, { scope: "local" });
  });
});
