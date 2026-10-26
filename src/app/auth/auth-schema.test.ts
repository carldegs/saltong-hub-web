import { describe, expect, it } from "vitest";
import { emailSchema, passwordSchema, signupSchema } from "./auth-schema";
import { profileValidationSchema } from "@/features/profiles/schemas";
import { groupValidationSchema } from "@/features/groups/schemas";

describe("validation after the Zod upgrade", () => {
  it("accepts valid signup data and reports password mismatches on confirmation", () => {
    const signup = {
      email: "player@example.com",
      password: "StrongPass1!",
      confirmPassword: "StrongPass1!",
    };
    expect(signupSchema.safeParse(signup).success).toBe(true);
    const result = signupSchema.safeParse({
      ...signup,
      confirmPassword: "other",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

  it("keeps actionable email and password validation errors", () => {
    const email = emailSchema.safeParse({ email: "invalid" });
    expect(email.success).toBe(false);
    if (!email.success) {
      expect(email.error.issues[0].message).toBe("Invalid email address");
    }
    for (const password of [
      "short",
      "alllowercase1!",
      "ALLUPPERCASE1!",
      "NoDigits!",
      "NoSpecial1",
    ]) {
      expect(passwordSchema.safeParse(password).success).toBe(false);
    }
  });

  it("preserves profile username rules and optional empty fields", () => {
    expect(
      profileValidationSchema.safeParse({
        username: "player_1",
        display_name: "",
        avatar_url: "",
      }).success
    ).toBe(true);
    for (const username of [".player", "player.", "two..dots", "UPPERCASE"]) {
      expect(profileValidationSchema.safeParse({ username }).success).toBe(
        false
      );
    }
  });

  it("enforces group names and eight-character invite codes", () => {
    expect(
      groupValidationSchema.safeParse({
        name: "Players",
        inviteCode: "ABCDEFGH",
      }).success
    ).toBe(true);
    expect(groupValidationSchema.safeParse({ name: "ab" }).success).toBe(false);
    expect(
      groupValidationSchema.safeParse({ name: "Players", inviteCode: "short" })
        .success
    ).toBe(false);
  });
});
