import { Metadata } from "next";
import SaltongVaultPage from "@/features/saltong/components/vault/vault-page";

export const metadata: Metadata = {
  title: "Saltong Vault",
};

const MODE = "classic";

export default async function SaltongMainVaultPage(props: {
  searchParams: Promise<{ d?: string }>;
}) {
  const searchParams = await props.searchParams;
  return <SaltongVaultPage searchParams={searchParams} mode={MODE} />;
}
