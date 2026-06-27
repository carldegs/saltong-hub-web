"use server";

import UnauthorizedErrorPage from "@/app/components/unauthorized-error-page";
import NavbarUser from "@/components/shared/navbar-user";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { playPageBackgroundVariants } from "@/components/shared/play-page-background";
import { ComponentProps } from "react";
import { notFound } from "next/navigation";
import { VaultIcon } from "lucide-react";
import Link from "next/link";
import { SUDOKU_CONFIG } from "../config";
import { Grid } from "../generator";
import { getSudokuGamePath, getSudokuVaultPath } from "../paths";
import { getSudokuSeed } from "../seeds";
import { SudokuMode } from "../types";
import {
  getSudokuGameDate,
  getSudokuModeConfig,
  getSudokuRoundIdFromDate,
  isSudokuDateBeforeStart,
} from "../utils";
import { getFormattedDateInPh, isFormattedDateInFuture } from "@/utils/time";
import SudokuGrid from "../components/sudoku-grid";
import SudokuHowToPlay from "../components/sudoku-how-to-play";
import SudokuTodayDropdown from "../components/sudoku-today-dropdown";

const navbarColorScheme = SUDOKU_CONFIG.colorScheme as ComponentProps<
  typeof Navbar
>["colorScheme"];

export default async function SudokuGamePage({
  mode,
  searchParams: _searchParams,
}: {
  mode: SudokuMode;
  searchParams: Promise<{ d?: string }>;
}) {
  const searchParams = await _searchParams;
  const date = getSudokuGameDate(searchParams?.d);

  if (
    (searchParams?.d && isFormattedDateInFuture(searchParams.d)) ||
    isSudokuDateBeforeStart(date)
  ) {
    return notFound();
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (
    !claimsData?.claims &&
    searchParams?.d &&
    searchParams.d !== getFormattedDateInPh()
  ) {
    return (
      <UnauthorizedErrorPage
        {...SUDOKU_CONFIG}
        pathname={`/play${getSudokuGamePath(mode)}?d=${searchParams.d}`}
      />
    );
  }

  const modeConfig = getSudokuModeConfig(mode);
  const roundId = getSudokuRoundIdFromDate(date);
  const targetSeed = getSudokuSeed(date, mode);
  const generated = new Grid().generate({
    seed: targetSeed,
    removalRange: modeConfig.removalRange,
  });

  return (
    <div className="grid min-h-svh w-full grid-rows-[auto_1fr]">
      <Navbar colorScheme={navbarColorScheme} hideUserDropdown>
        <NavbarBrand
          colorScheme={navbarColorScheme}
          title="Sudoku"
          subtitle={modeConfig.displayName}
          boxed={`#${roundId}`}
          icon={SUDOKU_CONFIG.icon}
          href="/"
          prefetch={false}
        />
        <div className="flex gap-1.5">
          <SudokuTodayDropdown />
          <SudokuHowToPlay />
          <Button variant="outline" asChild>
            <Link href={`/play${getSudokuVaultPath()}`} prefetch={false}>
              <VaultIcon />
              <span className="hidden md:block">Vault</span>
            </Link>
          </Button>
          <NavbarUser />
        </div>
      </Navbar>

      <main
        className={`${playPageBackgroundVariants({ colorScheme: "orange" })} min-h-0 overflow-hidden`}
      >
        <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col px-2 py-2 sm:px-4 sm:py-4 lg:py-8">
          <div className="grid h-full min-h-0">
            <SudokuGrid
              puzzle={generated.puzzle}
              solution={generated.solution}
              mode={mode}
              date={date}
              roundId={roundId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
