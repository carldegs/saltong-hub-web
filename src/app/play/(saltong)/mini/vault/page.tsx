import { Metadata } from "next";
import SaltongVaultPage from "@/features/saltong/components/vault/vault-page";

export const metadata: Metadata = {
  title: "Saltong Mini Vault",
};

const MODE = "mini";

export default async function SaltongMiniVaultPage(props: {
  searchParams: Promise<{ d?: string }>;
}) {
  const searchParams = await props.searchParams;
  return <SaltongVaultPage searchParams={searchParams} mode={MODE} />;
}
