import { Metadata } from "next";
import SudokuVaultPage from "@/features/sudoku/templates/sudoku-vault-page";

export const metadata: Metadata = {
  title: "Sudoku Vault",
  description: "Browse archived Sudoku routes and open previous dates.",
  openGraph: {
    title: "Sudoku Vault",
    description: "Browse archived Sudoku routes and open previous dates.",
    type: "website",
    url: "https://saltong.com/play/sudoku/vault",
  },
};

export default async function SudokuVaultRoutePage(props: {
  searchParams: Promise<{ d?: string }>;
}) {
  const searchParams = await props.searchParams;
  return <SudokuVaultPage searchParams={searchParams} />;
}
