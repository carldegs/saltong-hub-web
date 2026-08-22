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
import { canonicalUrl, pageIndexingMetadata } from "@/lib/seo";

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

  const searchParams = await props.searchParams;
  const date = getSudokuGameDate(searchParams?.d);
  const difficulty = params.difficulty;
  const path = `/play/sudoku/${difficulty}`;
  const title = `Sudoku ${getSudokuModeConfig(difficulty).displayName}`;
  const description = `Play the ${difficulty} Sudoku grid for ${date}.`;
  const indexing = pageIndexingMetadata(path, !Boolean(searchParams?.d));

  return {
    title,
    description,
    ...indexing,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl(path),
    },
  };
}

export default async function SudokuDifficultyPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const date = getSudokuGameDate(searchParams?.d);

  if (
    !isSudokuMode(params.difficulty) ||
    (searchParams?.d && isFormattedDateInFuture(searchParams.d)) ||
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
