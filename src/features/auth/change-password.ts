import { changePasswordSchema } from "@/app/auth/auth-schema";
import { z } from "zod";

type PasswordUpdateError = {
  code?: string;
  message: string;
};

export type ChangePasswordClient = {
  auth: {
    updateUser: (attributes: {
      password: string;
      current_password: string;
    }) => Promise<{ error: PasswordUpdateError | null }>;
  };
};

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export async function changePassword(
  client: ChangePasswordClient,
  input: ChangePasswordInput
): Promise<{ error: string | null }> {
  const result = changePasswordSchema.safeParse(input);

  if (!result.success) {
    return {
      error: result.error.errors[0]?.message ?? "Invalid password details",
    };
  }

  const { error } = await client.auth.updateUser({
    password: result.data.password,
    current_password: result.data.currentPassword,
  });

  if (!error) {
    return { error: null };
  }

  if (
    error.code === "current_password_invalid" ||
    error.code === "current_password_mismatch"
  ) {
    return { error: "Current password is incorrect." };
  }

  return { error: "Unable to change password. Please try again." };
}
