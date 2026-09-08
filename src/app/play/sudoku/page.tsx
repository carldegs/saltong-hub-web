import { Metadata } from "next";
import SudokuSelectorPage from "@/features/sudoku/templates/sudoku-selector-page";
import { canonicalUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { gameJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Sudoku",
  description: "Choose a Sudoku difficulty and play today’s grid.",
  openGraph: {
    title: "Sudoku",
    description: "Choose a Sudoku difficulty and play today’s grid.",
    type: "website",
    url: canonicalUrl("/play/sudoku"),
  },
};

export default function SudokuPage() {
  return (
    <>
      <JsonLd
        data={gameJsonLd({
          name: "Sudoku",
          description: "A daily Sudoku puzzle with selectable difficulty.",
          path: "/play/sudoku",
          genre: "Puzzle game",
        })}
      />
      <SudokuSelectorPage />
    </>
  );
}
