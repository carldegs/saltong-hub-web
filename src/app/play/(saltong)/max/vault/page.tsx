import { generateSaltongVaultMetadata } from "@/features/saltong/utils/generateSaltongVaultMetadata";
import SaltongVaultPage from "@/features/saltong/components/vault/vault-page";

const MODE = "max";

export async function generateMetadata() {
  return generateSaltongVaultMetadata({ mode: MODE });
}

export default async function SaltongMaxVaultPage(props: {
  searchParams: Promise<{ d?: string }>;
}) {
  const searchParams = await props.searchParams;
  return <SaltongVaultPage searchParams={searchParams} mode={MODE} />;
}
