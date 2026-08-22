import type { Metadata } from "next";
import MathinikVaultPage from "@/features/mathinik/templates/mathinik-vault-page";

export const metadata: Metadata = {
  title: "Mathinik Vault",
  description: "Browse archived Mathinik rounds and open previous dates.",
  openGraph: {
    title: "Mathinik Vault",
    description: "Browse archived Mathinik rounds and open previous dates.",
    type: "website",
    url: "https://saltong.com/play/mathinik/vault",
  },
};

export default async function MathinikVaultRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  return <MathinikVaultPage searchParams={await searchParams} />;
}
