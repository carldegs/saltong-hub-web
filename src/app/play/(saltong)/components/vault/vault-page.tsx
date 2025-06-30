import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { ComponentProps } from "react";
import VaultMonthlyCalendar from "./vault-monthly-calendar";
import { createClient } from "@/lib/supabase/server";
import UnauthorizedErrorPage from "../../../../components/unauthorized-error-page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SaltongGameSettings } from "@/app/play/types";

export default async function SaltongVaultPage({
  searchParams,
  ...gameSettings
}: {
  searchParams: { d?: string };
} & Pick<
  SaltongGameSettings,
  "colorScheme" | "name" | "icon" | "config" | "id" | "path"
>) {
  const { colorScheme, name, icon, config, id: gameId, path } = gameSettings;
  const { startDate } = config;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return <UnauthorizedErrorPage {...gameSettings} />;
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
          <Link href={`/play${path}`}>Play Latest Game</Link>
        </Button>
      </Navbar>
      <div className="mx-auto w-full max-w-prose">
        <VaultMonthlyCalendar
          gameId={gameId}
          path={path}
          startDate={startDate}
          focusedDate={
            !isNaN(Number(searchParams?.d))
              ? new Date(Number(searchParams.d) * 100000)
              : new Date()
          }
        />
      </div>
    </>
  );
}
