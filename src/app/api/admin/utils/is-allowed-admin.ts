export function isAllowedAdmin(userId: string | undefined | null) {
  if (!userId) return false;

  const allowedAdmins =
    process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) ?? [];

  return allowedAdmins.includes(userId);
}
