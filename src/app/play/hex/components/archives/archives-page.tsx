import { GameConfig } from "@/app/play/(saltong)/types";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { ComponentProps } from "react";
import ArchiveMonthlyCalendar from "./archive-calendar";
import { createClient } from "@/lib/supabase/server";
import UnauthorizedErrorPage from "@/app/components/unauthorized-error-page";

export default async function SaltongArchivePage({
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
        <ArchiveMonthlyCalendar />
      </div>
    </>
  );
}
