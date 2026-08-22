import UnauthorizedErrorPage from "@/app/components/unauthorized-error-page";
import NavbarUser from "@/components/shared/navbar-user";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { CalculatorIcon } from "lucide-react";
import Link from "next/link";
import { ComponentProps } from "react";
import { MATHINIK_CONFIG } from "../config";
import MathinikVaultCalendar from "../components/vault/vault-calendar";

const navbarColorScheme = MATHINIK_CONFIG.colorScheme as ComponentProps<
  typeof Navbar
>["colorScheme"];

export default async function MathinikVaultPage({
  searchParams,
}: {
  searchParams: { d?: string };
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return (
      <UnauthorizedErrorPage
        {...MATHINIK_CONFIG}
        pathname={MATHINIK_CONFIG.vaultPath}
      />
    );
  }

  return (
    <>
      <Navbar colorScheme={navbarColorScheme} hideUserDropdown>
        <NavbarBrand
          colorScheme={navbarColorScheme}
          title="Mathinik"
          subtitle="Vault"
          icon={MATHINIK_CONFIG.icon}
          href="/"
          prefetch={false}
        />
        <div className="flex gap-1.5">
          <Button variant="outline" asChild>
            <Link href="/play/mathinik" prefetch={false}>
              <CalculatorIcon />
              Today
            </Link>
          </Button>
          <NavbarUser />
        </div>
      </Navbar>
      <div className="mx-auto w-full max-w-prose">
        <MathinikVaultCalendar
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
