import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function checkAdminAccess() {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return { isAdmin: false };
  }

  // Get allowed admin user IDs from environment variable
  const allowedAdmins =
    process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || [];

  // Check if user's ID is in the allowed list
  const isAdmin = allowedAdmins.includes(data.claims.sub);

  return { isAdmin };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin } = await checkAdminAccess();

  if (!isAdmin) {
    notFound();
  }

  return <>{children}</>;
}
