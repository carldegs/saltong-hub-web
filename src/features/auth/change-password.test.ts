import { describe, expect, it, vi } from "vitest";
import { changePassword, type ChangePasswordClient } from "./change-password";

const validInput = {
  currentPassword: "ExistingPassword1!",
  password: "ValidPassword1!",
  confirmPassword: "ValidPassword1!",
};

function createClient(updateUser = vi.fn().mockResolvedValue({ error: null })) {
  return {
    auth: { updateUser },
  } satisfies ChangePasswordClient;
}

describe("changePassword", () => {
  it("rejects mismatched new passwords without calling Supabase", async () => {
    const updateUser = vi.fn();
    const client = createClient(updateUser);

    await expect(
      changePassword(client, {
        ...validInput,
        confirmPassword: "DifferentPassword1!",
      })
    ).resolves.toEqual({ error: "Passwords do not match" });

    expect(updateUser).not.toHaveBeenCalled();
  });

  it("sends the current and new passwords to Supabase", async () => {
    const updateUser = vi.fn().mockResolvedValue({ error: null });
    const client = createClient(updateUser);

    await expect(changePassword(client, validInput)).resolves.toEqual({
      error: null,
    });

    expect(updateUser).toHaveBeenCalledWith({
      password: validInput.password,
      current_password: validInput.currentPassword,
    });
  });

  it("returns a safe message when the current password is incorrect", async () => {
    const client = createClient(
      vi.fn().mockResolvedValue({
        error: {
          code: "current_password_invalid",
          message: "Current password required when setting new password.",
        },
      })
    );

    await expect(changePassword(client, validInput)).resolves.toEqual({
      error: "Current password is incorrect.",
    });
  });
});
