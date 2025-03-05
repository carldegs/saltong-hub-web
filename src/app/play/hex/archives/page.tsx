import { Metadata } from "next";
import { HEX_CONFIG } from "../constants";
import { createClient } from "@/lib/supabase/server";
import UnauthorizedErrorPage from "../components/archives/unauthorized-error-page";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { ComponentProps } from "react";
import ArchiveCalendar from "../components/archives/archive-calendar";

export const metadata: Metadata = {
  title: "Saltong Hex Archives",
};

export default async function SaltongHexArchivePage() {
  const gameConfig = HEX_CONFIG;
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
        <ArchiveCalendar />
      </div>
    </>
  );
}
