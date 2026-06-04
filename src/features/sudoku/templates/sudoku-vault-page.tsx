import UnauthorizedErrorPage from "@/app/components/unauthorized-error-page";
import NavbarUser from "@/components/shared/navbar-user";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Grid3X3Icon } from "lucide-react";
import { ComponentProps } from "react";
import Link from "next/link";
import { SUDOKU_CONFIG } from "../config";
import SudokuVaultCalendar from "../components/vault/vault-calendar";

const navbarColorScheme = SUDOKU_CONFIG.colorScheme as ComponentProps<
  typeof Navbar
>["colorScheme"];

export default async function SudokuVaultPage({
  searchParams,
}: {
  searchParams: { d?: string };
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return (
      <UnauthorizedErrorPage
        {...SUDOKU_CONFIG}
        pathname={`/play${SUDOKU_CONFIG.vaultPath}`}
      />
    );
  }

  return (
    <>
      <Navbar colorScheme={navbarColorScheme} hideUserDropdown>
        <NavbarBrand
          colorScheme={navbarColorScheme}
          title="Sudoku"
          subtitle="Vault"
          icon={SUDOKU_CONFIG.icon}
          href="/"
          prefetch={false}
        />
        <div className="flex gap-1.5">
          <Button variant="outline" asChild>
            <Link href="/play/sudoku" prefetch={false}>
              <Grid3X3Icon />
              Difficulty Selector
            </Link>
          </Button>
          <NavbarUser />
        </div>
      </Navbar>
      <div className="mx-auto w-full max-w-prose">
        <SudokuVaultCalendar
          focusedDate={
            !isNaN(Number(searchParams?.d))
              ? new Date(Number(searchParams.d) * 100000)
              : new Date()
          }
        />
      </div>
    </>
  );
}
