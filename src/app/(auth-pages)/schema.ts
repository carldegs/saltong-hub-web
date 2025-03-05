import { z } from "zod";

export const signupServerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const signupClientSchema = signupServerSchema
  .extend({ confirmPassword: z.string() })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpActionState = {
  email?: string;
  password?: string;
  errors?: {
    email?: string[];
    password?: string[];
    main?: string[];
  };
};

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginActionState = {
  email: string;
  password: string;
  error?: string;
  f?: string;
};
