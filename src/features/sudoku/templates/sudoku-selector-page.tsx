import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { SUDOKU_CONFIG } from "../config";
import { getSudokuGamePath } from "../paths";
import { ComponentProps } from "react";
import Link from "next/link";

const navbarColorScheme = SUDOKU_CONFIG.colorScheme as ComponentProps<
  typeof Navbar
>["colorScheme"];

export default function SudokuSelectorPage() {
  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_1fr]">
      <Navbar colorScheme={navbarColorScheme} hideUserDropdown>
        <NavbarBrand
          colorScheme={navbarColorScheme}
          title="Sudoku"
          icon={SUDOKU_CONFIG.icon}
          href="/"
          prefetch={false}
        />
      </Navbar>

      <main className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-6 px-4 py-8">
        <h1 className="text-center text-orange-500">Select Difficulty</h1>
        <div className="flex w-full flex-col gap-3">
          {Object.values(SUDOKU_CONFIG.modes).map((modeConfig) => (
            <Button
              key={modeConfig.mode}
              asChild
              className="bg-saltong-orange-500 hover:bg-saltong-orange-600 h-12 text-base"
            >
              {/* TODO: Change button style when this difficulty has already been completed for the day. */}
              <Link
                href={`/play${getSudokuGamePath(modeConfig.mode)}`}
                prefetch={false}
              >
                {modeConfig.displayName}
              </Link>
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
}
