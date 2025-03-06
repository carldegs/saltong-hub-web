"use client";

import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GameConfig } from "@/app/play/(saltong)/types";
import { ComponentProps } from "react";
import { usePathname } from "next/navigation";

export default function UnauthorizedErrorPage(
  gameConfig: Pick<GameConfig, "colorScheme" | "subtitle" | "icon">
) {
  const { colorScheme, subtitle, icon } = gameConfig;
  const currPathname = usePathname();

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
      <div className="a flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="max-w-lg p-6 text-center">
          <h1 className="mb-1.5 text-3xl font-bold">Sorry po!</h1>
          <div className="text-muted-foreground mb-8 text-lg">
            An account is required to play past rounds of{" "}
            <b>Saltong{subtitle ? ` ${subtitle}` : ""}</b>. Sign up for free or
            login to continue.
          </div>
          <div className="flex items-center justify-center gap-6">
            <Button size="lg" asChild className="w-full">
              <Link
                href={{
                  pathname: "/login",
                  query: { f: currPathname },
                }}
              >
                Log in
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="w-full">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
