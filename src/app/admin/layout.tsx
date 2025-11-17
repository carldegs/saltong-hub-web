import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function checkAdminAccess() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { isAdmin: false };
  }

  // Get allowed admin user IDs from environment variable
  const allowedAdmins =
    process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || [];

  // Check if user's ID is in the allowed list
  const isAdmin = allowedAdmins.includes(user.id);

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
