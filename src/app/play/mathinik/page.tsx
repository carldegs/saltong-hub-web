import {
  getMathinikGameDate,
  getMathinikRoundIdFromDate,
  isMathinikDateBeforeStart,
} from "@/features/mathinik/utils";
import { getFormattedDateInPh, isFormattedDateInFuture } from "@/utils/time";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import UnauthorizedErrorPage from "@/app/components/unauthorized-error-page";
import { MATHINIK_CONFIG } from "@/features/mathinik/config";
import { MathinikGenerator } from "@/features/mathinik/generator";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { ComponentProps } from "react";
import { playPageBackgroundVariants } from "@/components/shared/play-page-background";
import PlayArea, {
  MathinikHowToPlayDialog,
} from "@/features/mathinik/components/play-area";

interface Props {
  searchParams: Promise<{ d?: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const date = getMathinikGameDate((await props.searchParams)?.d);
  const title = "Mathinik";

  return {
    title,
    description: `Combine six random numbers using basic arithmetic to hit a target. Play the Mathinik game for ${date}.`,
    openGraph: {
      title,
      description: `Combine six random numbers using basic arithmetic to hit a target. Play the Mathinik game for ${date}.`,
      type: "website",
      url: `https://saltong.com/play/mathinik?d=${date}`,
    },
  };
}

const navbarColorScheme = MATHINIK_CONFIG.colorScheme as ComponentProps<
  typeof Navbar
>["colorScheme"];

export default async function MathinikPage(props: Props) {
  const searchParams = await props.searchParams;
  const date = getMathinikGameDate(searchParams?.d);

  if (
    (searchParams?.d && isFormattedDateInFuture(searchParams.d)) ||
    isMathinikDateBeforeStart(date)
  ) {
    return notFound();
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (
    !claimsData?.claims &&
    searchParams?.d &&
    searchParams.d !== getFormattedDateInPh()
  ) {
    return (
      <UnauthorizedErrorPage
        {...MATHINIK_CONFIG}
        pathname={`/play/mathinik?d=${searchParams.d}`}
      />
    );
  }

  const roundId = getMathinikRoundIdFromDate(date);
  const generated = new MathinikGenerator().generate({
    seed: date,
  });

  return (
    <div className="grid h-svh w-full grid-rows-[auto_minmax(0,1fr)] overflow-hidden">
      <Navbar colorScheme={navbarColorScheme} hideUserDropdown>
        <NavbarBrand
          colorScheme={navbarColorScheme}
          title="Mathinik"
          boxed={`#${roundId}`}
          icon={MATHINIK_CONFIG.icon}
          href="/"
          prefetch={false}
        />
        <div className="flex gap-1.5">
          <MathinikHowToPlayDialog />
        </div>
      </Navbar>
      <main
        className={`${playPageBackgroundVariants({ colorScheme: "teal" })} min-h-0 overflow-hidden`}
      >
        <PlayArea round={generated} roundId={roundId} />
      </main>
    </div>
  );
}
