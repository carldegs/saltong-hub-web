import { createClient } from "@/lib/supabase/server";

export function isAllowedAdmin(userId: string | undefined | null) {
  if (!userId) return false;

  const allowedAdmins =
    process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) ?? [];

  return allowedAdmins.includes(userId);
}

export type AllowedAdminResult =
  | { ok: true; userId: string }
  | { ok: false; error: "Unauthorized" | "Forbidden" };

export async function requireAllowedAdmin(): Promise<AllowedAdminResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    return { ok: false, error: "Unauthorized" };
  }

  if (!isAllowedAdmin(userId)) {
    return { ok: false, error: "Forbidden" };
  }

  return { ok: true, userId };
}
