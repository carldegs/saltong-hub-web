import { Metadata } from "next";
import { SALTONG_CONFIG } from "@/features/saltong/config";
import { SaltongMode } from "../types";

export interface SaltongVaultMetadataParams {
  mode: SaltongMode;
}

export async function generateSaltongVaultMetadata({
  mode,
}: SaltongVaultMetadataParams): Promise<Metadata> {
  const displayName = SALTONG_CONFIG.modes[mode]?.displayName || "Saltong";
  const description = `Play with previous ${displayName} rounds at the Saltong Vault.`;

  return {
    title: `${displayName} Vault`,
    description,
    openGraph: {
      title: `${displayName} Vault`,
      description,
      type: "website",
      url: `https://saltong.com/play${mode === "classic" ? "" : `/${mode}`}/vault`,
    },
  };
}
