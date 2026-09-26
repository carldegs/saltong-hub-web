import { notFound } from "next/navigation";

import { requireAllowedAdmin } from "@/app/api/admin/utils/is-allowed-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await requireAllowedAdmin();

  if (!access.ok) {
    notFound();
  }

  return <>{children}</>;
}
