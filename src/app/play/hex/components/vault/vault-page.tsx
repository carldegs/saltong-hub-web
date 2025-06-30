import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { ComponentProps } from "react";
import VaultMonthlyCalendar from "./vault-calendar";
import { createClient } from "@/lib/supabase/server";
import UnauthorizedErrorPage from "@/app/components/unauthorized-error-page";
import { GameSettings } from "@/app/play/types";

export default async function SaltongVaultPage({
  ...gameConfig
}: {
  searchParams: { d?: string };
} & Pick<GameSettings, "colorScheme" | "name" | "icon">) {
  const { colorScheme, name, icon } = gameConfig;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
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
          name={name}
          icon={icon}
          href="/"
          prefetch={false}
        />
      </Navbar>
      <div className="mx-auto w-full max-w-prose">
        <VaultMonthlyCalendar />
      </div>
    </>
  );
}
