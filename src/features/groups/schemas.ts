import { z } from "zod";
import type { Group } from "./types";

export const groupValidationSchema = z.object({
  name: z
    .string()
    .min(3, "Group name is required")
    .max(50, "Group name is too long"),
  invitesEnabled: z.boolean().optional(),
  inviteCode: z
    .string()
    .min(8, "Invite code must be 8 characters")
    .max(8, "Invite code must be 8 characters")
    .optional(),
}) satisfies z.ZodType<Partial<Group>>;

export type GroupValidationSchema = z.infer<typeof groupValidationSchema>;
