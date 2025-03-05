import { GameConfig } from "@/app/play/(saltong)/types";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { ComponentProps } from "react";
import ArchiveMonthlyCalendar from "./archive-calendar";
import { createClient } from "@/lib/supabase/server";
import UnauthorizedErrorPage from "./unauthorized-error-page";

export default async function SaltongArchivePage({
  searchParams,
  ...gameConfig
}: {
  searchParams: { d?: string };
} & Pick<
  GameConfig,
  "colorScheme" | "subtitle" | "icon" | "startDate" | "mode"
>) {
  const { colorScheme, subtitle, icon } = gameConfig;

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
          subtitle={subtitle}
          icon={icon}
        />
      </Navbar>
      <div className="mx-auto w-full max-w-prose">
        <ArchiveMonthlyCalendar
          {...gameConfig}
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
