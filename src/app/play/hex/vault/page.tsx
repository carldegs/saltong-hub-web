import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import UnauthorizedErrorPage from "@/app/components/unauthorized-error-page";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { ComponentProps } from "react";
import VaultCalendar from "@/features/hex/components/vault/vault-calendar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HEX_CONFIG } from "@/features/hex/config";
import NavbarUser from "@/components/shared/navbar-user";

export const metadata: Metadata = {
  title: "Saltong Hex Vault",
};

export default async function SaltongHexVaultPage() {
  const { colorScheme, icon } = HEX_CONFIG;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return <UnauthorizedErrorPage {...HEX_CONFIG} />;
  }

  return (
    <>
      <Navbar
        colorScheme={
          colorScheme as ComponentProps<typeof Navbar>["colorScheme"]
        }
        hideUserDropdown
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

        <div className="flex gap-1.5">
          <Button variant="outline" asChild>
            <Link href="/play/hex">Play Latest Game</Link>
          </Button>
          <NavbarUser />
        </div>
      </Navbar>
      <div className="mx-auto w-full max-w-prose">
        <VaultCalendar userId={data?.claims?.sub} />
      </div>
    </>
  );
}
