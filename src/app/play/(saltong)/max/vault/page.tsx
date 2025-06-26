import { Metadata } from "next";
import SaltongVaultPage from "../../components/vault/vault-page";
import { GAME_SETTINGS } from "@/app/play/constants";

export const metadata: Metadata = {
  title: "Saltong Max Vault",
};

export default async function SaltongMaxVaultPage(props: {
  searchParams: Promise<{ d?: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <SaltongVaultPage
      searchParams={searchParams}
      {...GAME_SETTINGS["saltong-max"]}
    />
  );
}
