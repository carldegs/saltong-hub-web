import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { ComponentProps } from "react";
import VaultMonthlyCalendar from "./vault-monthly-calendar";
import { createClient } from "@/lib/supabase/server";
import UnauthorizedErrorPage from "../../../../app/components/unauthorized-error-page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SaltongMode } from "../../types";
import { SALTONG_CONFIG } from "../../config";
import NavbarUser from "@/components/shared/navbar-user";

export default async function SaltongVaultPage({
  searchParams,
  mode,
}: {
  searchParams: { d?: string };
  mode: SaltongMode;
}) {
  const gameSettings = SALTONG_CONFIG.modes[mode];

  const { colorScheme, icon, path, startDate, displayName } = gameSettings;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return <UnauthorizedErrorPage {...gameSettings} />;
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
          name={displayName}
          icon={icon}
          href="/"
          prefetch={false}
        />

        <div className="flex gap-1.5">
          <Button variant="outline" asChild>
            <Link href={`/play${path}`}>Play Latest Game</Link>
          </Button>
          <NavbarUser />
        </div>
      </Navbar>
      <div className="mx-auto w-full max-w-prose">
        <VaultMonthlyCalendar
          mode={mode}
          path={path}
          gameModeStartDate={startDate}
          focusedDate={
            !isNaN(Number(searchParams?.d))
              ? new Date(Number(searchParams.d) * 100000)
              : new Date()
          }
          userId={data?.claims?.sub}
        />
      </div>
    </>
  );
}
