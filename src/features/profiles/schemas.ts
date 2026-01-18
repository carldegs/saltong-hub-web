import z from "zod";

export const profileValidationSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(32, "Username must be at most 32 characters")
    .regex(
      /^[a-z0-9._-]+$/,
      "Username can only contain lowercase letters, numbers, underscores, dashes, and periods"
    )
    .refine(
      (val) => !val.includes(".."),
      "Username cannot contain consecutive periods"
    )
    .refine(
      (val) => !val.startsWith("."),
      "Username cannot start with a period"
    )
    .refine((val) => !val.endsWith("."), "Username cannot end with a period"),
  display_name: z
    .string()
    .min(1, "Display name must be at least 1 character")
    .max(32, "Display name must be at most 32 characters")
    .optional()
    .or(z.literal("")),
  avatar_url: z.string().url().optional().or(z.literal("")),
});
