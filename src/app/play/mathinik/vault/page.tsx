import type { Metadata } from "next";
import MathinikVaultPage from "@/features/mathinik/templates/mathinik-vault-page";
import { canonicalUrl, pageIndexingMetadata } from "@/lib/seo";

const path = "/play/mathinik/vault";

export const metadata: Metadata = {
  ...pageIndexingMetadata(path, false),
  title: "Mathinik Vault",
  description: "Browse archived Mathinik rounds and open previous dates.",
  openGraph: {
    title: "Mathinik Vault",
    description: "Browse archived Mathinik rounds and open previous dates.",
    type: "website",
    url: canonicalUrl(path),
  },
};

export default async function MathinikVaultRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  return <MathinikVaultPage searchParams={await searchParams} />;
}
