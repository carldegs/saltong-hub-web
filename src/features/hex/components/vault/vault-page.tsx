import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { ComponentProps } from "react";
import VaultMonthlyCalendar from "./vault-calendar";
import { createClient } from "@/lib/supabase/server";
import UnauthorizedErrorPage from "@/app/components/unauthorized-error-page";
import { HEX_CONFIG } from "../../config";

export default async function SaltongVaultPage({
  ...gameConfig
}: {
  searchParams: { d?: string };
} & Pick<typeof HEX_CONFIG, "colorScheme" | "displayName" | "icon">) {
  const { colorScheme, icon } = gameConfig;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return <UnauthorizedErrorPage {...gameConfig} />;
  }

  return (
    <>
      <Navbar
        colorScheme={
          colorScheme as ComponentProps<typeof Navbar>["colorScheme"]
        }
      >
        <NavbarBrand
          colorScheme={
            colorScheme as ComponentProps<typeof Navbar>["colorScheme"]
          }
          title="Saltong"
          name="Hex"
          icon={icon}
          href="/"
          prefetch={false}
        />
      </Navbar>
      <div className="mx-auto w-full max-w-prose">
        <VaultMonthlyCalendar userId={data?.claims?.sub} />
      </div>
    </>
  );
}
