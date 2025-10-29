import { Metadata } from "next";
import SaltongVaultPage from "@/features/saltong/components/vault/vault-page";

export const metadata: Metadata = {
  title: "Saltong Max Vault",
};

const MODE = "max";

export default async function SaltongMaxVaultPage(props: {
  searchParams: Promise<{ d?: string }>;
}) {
  const searchParams = await props.searchParams;
  return <SaltongVaultPage searchParams={searchParams} mode={MODE} />;
}
