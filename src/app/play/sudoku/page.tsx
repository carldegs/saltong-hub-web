import { Metadata } from "next";
import SudokuSelectorPage from "@/features/sudoku/templates/sudoku-selector-page";
import { canonicalUrl } from "@/lib/seo";

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
  return <SudokuSelectorPage />;
}
