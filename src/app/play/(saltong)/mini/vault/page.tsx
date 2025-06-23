import { Metadata } from "next";
import { SALTONG_CONFIGS } from "../../constants";
import SaltongVaultPage from "../../components/vault/vault-page";

export const metadata: Metadata = {
  title: "Saltong Mini Vault",
};

export default async function SaltongMiniVaultPage(props: {
  searchParams: Promise<{ d?: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <SaltongVaultPage
      searchParams={searchParams}
      {...SALTONG_CONFIGS["mini"]}
    />
  );
}
