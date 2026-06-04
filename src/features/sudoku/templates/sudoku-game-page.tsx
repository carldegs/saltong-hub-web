"use server";

import UnauthorizedErrorPage from "@/app/components/unauthorized-error-page";
import NavbarUser from "@/components/shared/navbar-user";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { playPageBackgroundVariants } from "@/components/shared/play-page-background";
import { ComponentProps } from "react";
import { notFound } from "next/navigation";
import { CalendarDaysIcon, Grid2X2Icon, VaultIcon } from "lucide-react";
import Link from "next/link";
import { SUDOKU_CONFIG } from "../config";
import { Grid } from "../generator";
import {
  getSudokuDifficultySelectorPath,
  getSudokuGamePath,
  getSudokuVaultPath,
} from "../paths";
import { getSudokuSeed } from "../seeds";
import { SudokuMode } from "../types";
import SudokuPreviewGrid from "../components/sudoku-preview-grid";
import {
  getSudokuGameDate,
  getSudokuModeConfig,
  getSudokuRoundIdFromDate,
  isSudokuDateBeforeStart,
} from "../utils";
import { getFormattedDateInPh, isFormattedDateInFuture } from "@/utils/time";
import SudokuGrid from "../components/sudoku-grid";

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

  if (isFormattedDateInFuture(date) || isSudokuDateBeforeStart(date)) {
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
  const isArchive = date !== getFormattedDateInPh();

  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_1fr]">
      <Navbar colorScheme={navbarColorScheme} hideUserDropdown>
        <NavbarBrand
          colorScheme={navbarColorScheme}
          title="Sudoku"
          boxed={`#${roundId}`}
          icon={SUDOKU_CONFIG.icon}
          href="/"
          prefetch={false}
        />
        <div className="flex gap-1.5">
          <Button variant="outline" asChild>
            <Link
              href={`/play${getSudokuDifficultySelectorPath()}`}
              prefetch={false}
            >
              <Grid2X2Icon />
              <span className="hidden md:block">Today&apos;s Puzzles</span>
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/play${getSudokuVaultPath()}`} prefetch={false}>
              <VaultIcon />
              <span className="hidden md:block">Vault</span>
            </Link>
          </Button>
          <NavbarUser />
        </div>
      </Navbar>

      <main className={playPageBackgroundVariants({ colorScheme: "orange" })}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
          <div className="grid gap-6">
            <SudokuGrid puzzle={generated.puzzle} />
            {/* <SudokuPreviewGrid puzzle={generated.puzzle} /> */}
          </div>
        </div>
      </main>
    </div>
  );
}
