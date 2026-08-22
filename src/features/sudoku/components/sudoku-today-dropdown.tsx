"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SUDOKU_MODES } from "@/features/sudoku/config";
import { getSudokuGamePath } from "@/features/sudoku/paths";
import { ChevronDownIcon, Grid2X2Icon } from "lucide-react";
import Link from "next/link";

export default function SudokuTodayDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="respIcon">
          <Grid2X2Icon />
          <span className="hidden md:block">Today&apos;s Puzzle</span>
          <ChevronDownIcon className="hidden size-4 md:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {Object.values(SUDOKU_MODES).map(
          ({ mode, displayName, icon: Icon }) => (
            <DropdownMenuItem key={mode} asChild>
              <Link href={`/play${getSudokuGamePath(mode)}`} prefetch={false}>
                <Icon />
                {displayName}
              </Link>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
