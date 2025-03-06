import { Navbar } from "@/components/shared/navbar";
import DailyGamesCard from "./components/daily-games-card";
import HexGamesCard from "./components/hex-games-card";
import GameCard from "./components/game-card";
import { SALTONG_CONFIGS } from "./play/(saltong)/constants";
import { HEX_CONFIG } from "./play/hex/constants";
import HomeNavbarBrand from "./components/home-navbar-brand";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArchiveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function ArchivesAlert() {
  const supabase = await createClient();
  // safe to use here because archives page uses getUser
  const { data } = await supabase.auth.getSession();

  return (
    <Alert className="flex items-center gap-4 bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-100">
      <span className="relative animate-bounce">
        <ArchiveIcon className="absolute left-0 top-0 size-10 animate-ping opacity-30" />
        <ArchiveIcon className="size-10" />
      </span>
      <div className="flex flex-1 flex-col gap-0">
        <AlertTitle className="font-black uppercase tracking-widest">
          Archives Unlocked!
        </AlertTitle>
        <AlertDescription>
          You can now play previous rounds of all the games! Just sign up to get
          started.
        </AlertDescription>
      </div>
      {!data.session && (
        <Button asChild className="bg-cyan-500 dark:bg-cyan-200">
          <Link href="/signup">Sign up</Link>
        </Button>
      )}
    </Alert>
  );
}

export default async function HomePage() {
  return (
    <div className="@container grid min-h-screen w-full grid-rows-[auto_1fr]">
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main className="h-full w-full">
        <div className="h-fit w-full border-b px-4 py-8">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-12">
            <DailyGamesCard className="md:col-span-7" />
            <HexGamesCard className="md:col-span-5" />
          </div>
        </div>
        <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8">
          <ArchivesAlert />
          <div className="@min-md:grid-cols-1 grid grid-cols-2 gap-4">
            <GameCard {...SALTONG_CONFIGS["main"]} />
            <GameCard {...SALTONG_CONFIGS["max"]} />
            <GameCard {...SALTONG_CONFIGS["mini"]} />
            <GameCard {...HEX_CONFIG} />
          </div>
        </div>
      </main>
    </div>
  );
}
