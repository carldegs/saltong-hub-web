import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const passwordSchema = z
  .string()
  .min(8, { message: "At least 8 characters" })
  .regex(/[a-z]/, { message: "At least one lowercase letter" })
  .regex(/[A-Z]/, { message: "At least one uppercase letter" })
  .regex(/[0-9]/, { message: "At least one number" })
  .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
    message: "At least one special character (!@#$%^&*()_+-=[]{};':\"|,.<>/?)",
  });

export const signupSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
