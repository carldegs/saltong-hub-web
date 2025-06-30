import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import UnauthorizedErrorPage from "@/app/components/unauthorized-error-page";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { ComponentProps } from "react";
import VaultCalendar from "../components/vault/vault-calendar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GAME_SETTINGS } from "../../constants";

export const metadata: Metadata = {
  title: "Saltong Hex Vault",
};

const SETTINGS = GAME_SETTINGS["hex"];

export default async function SaltongHexVaultPage() {
  const { colorScheme, name, icon } = SETTINGS;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return <UnauthorizedErrorPage {...SETTINGS} />;
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
          name={name}
          icon={icon}
          href="/"
          prefetch={false}
        />

        <Button variant="outline" asChild>
          <Link href="/play/hex">Play Latest Game</Link>
        </Button>
      </Navbar>
      <div className="mx-auto w-full max-w-prose">
        <VaultCalendar />
      </div>
    </>
  );
}
