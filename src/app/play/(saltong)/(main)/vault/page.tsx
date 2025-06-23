import { Metadata } from "next";
import { SALTONG_CONFIGS } from "../../constants";
import SaltongVaultPage from "../../components/vault/vault-page";

export const metadata: Metadata = {
  title: "Saltong Vault",
};

export default async function SaltongMainVaultPage(props: {
  searchParams: Promise<{ d?: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <SaltongVaultPage
      searchParams={searchParams}
      {...SALTONG_CONFIGS["main"]}
    />
  );
}
