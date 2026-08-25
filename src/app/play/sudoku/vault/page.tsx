import { Metadata } from "next";
import SudokuVaultPage from "@/features/sudoku/templates/sudoku-vault-page";
import { canonicalUrl, pageIndexingMetadata } from "@/lib/seo";

const path = "/play/sudoku/vault";

export const metadata: Metadata = {
  ...pageIndexingMetadata(path, false),
  title: "Sudoku Vault",
  description: "Browse archived Sudoku routes and open previous dates.",
  openGraph: {
    title: "Sudoku Vault",
    description: "Browse archived Sudoku routes and open previous dates.",
    type: "website",
    url: canonicalUrl(path),
  },
};

export default async function SudokuVaultRoutePage(props: {
  searchParams: Promise<{ d?: string }>;
}) {
  const searchParams = await props.searchParams;
  return <SudokuVaultPage searchParams={searchParams} />;
}
