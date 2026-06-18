import { Metadata } from "next";
import { notFound } from "next/navigation";
import SudokuGamePage from "@/features/sudoku/templates/sudoku-game-page";
import {
  getSudokuGameDate,
  getSudokuModeConfig,
  isSudokuMode,
} from "@/features/sudoku/utils";
import { isFormattedDateInFuture } from "@/utils/time";
import { isSudokuDateBeforeStart } from "@/features/sudoku/utils";

interface Props {
  params: Promise<{ difficulty: string }>;
  searchParams: Promise<{ d?: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  if (!isSudokuMode(params.difficulty)) {
    return {
      title: "Sudoku",
      description: "Play Sudoku.",
    };
  }

  const date = getSudokuGameDate((await props.searchParams)?.d);
  const difficulty = params.difficulty;
  const title = `Sudoku ${getSudokuModeConfig(difficulty).displayName}`;

  return {
    title,
    description: `Play the ${difficulty} Sudoku grid for ${date}.`,
    openGraph: {
      title,
      description: `Play the ${difficulty} Sudoku grid for ${date}.`,
      type: "website",
      url: `https://saltong.com/play/sudoku/${difficulty}`,
    },
  };
}

export default async function SudokuDifficultyPage(props: Props) {
  const params = await props.params;
  const date = getSudokuGameDate((await props.searchParams)?.d);

  if (
    !isSudokuMode(params.difficulty) ||
    isFormattedDateInFuture(date) ||
    isSudokuDateBeforeStart(date)
  ) {
    return notFound();
  }

  return (
    <SudokuGamePage
      mode={params.difficulty}
      searchParams={props.searchParams}
    />
  );
}
