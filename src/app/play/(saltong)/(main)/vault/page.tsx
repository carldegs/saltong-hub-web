import { generateSaltongVaultMetadata } from "@/features/saltong/utils/generateSaltongVaultMetadata";
import SaltongVaultPage from "@/features/saltong/components/vault/vault-page";

const MODE = "classic";

export async function generateMetadata() {
  return generateSaltongVaultMetadata({ mode: MODE });
}

export default async function SaltongMainVaultPage(props: {
  searchParams: Promise<{ d?: string }>;
}) {
  const searchParams = await props.searchParams;
  return <SaltongVaultPage searchParams={searchParams} mode={MODE} />;
}
