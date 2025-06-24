import { Navbar } from "@/components/shared/navbar";
import DailyGamesCard from "./components/daily-games-card";
import HexGamesCard from "./components/hex-games-card";
import GameCard from "./components/game-card";
import HomeNavbarBrand from "./components/home-navbar-brand";
import { VaultIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import { Particles } from "@/components/magicui/particles";
import { GAME_SETTINGS } from "./play/constants";

async function VaultsAlert() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-teal-300 bg-linear-to-br from-teal-200 to-teal-100 py-6 dark:from-teal-600/20 dark:to-teal-500/50">
      <VelocityScroll
        defaultVelocity={1}
        numRows={2}
        className="text-5xl text-teal-400 select-none md:text-6xl dark:text-teal-300/70"
      >
        THE SALTONG VAULT IS <b>UNLOCKED</b>.
      </VelocityScroll>
      <div className="flex w-full max-w-5xl flex-col items-end justify-between gap-8 px-4 pt-8 md:flex-row md:items-center md:px-6 md:pt-16">
        <span className="w-full max-w-sm self-start text-left text-lg leading-tight font-semibold tracking-tight text-teal-900 md:max-w-lg md:text-left dark:text-teal-100">
          Missed a round? You can now play all past Saltong games! <br />
          <br className="inline md:h-0 lg:hidden" />
          Just sign up to get started.
        </span>

        {!data.user ? (
          <Button asChild size="lg" className="font-bold tracking-widest">
            <Link href="/auth">CREATE ACCOUNT</Link>
          </Button>
        ) : (
          <Button asChild size="lg" className="font-bold tracking-wide">
            <Link href="/play/vault">
              <VaultIcon />
              PLAY NOW
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const allGames = Object.values(GAME_SETTINGS);

  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_1fr]">
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main className="@container/top h-full w-full">
        <div className="bg-muted/10 relative h-fit w-full overflow-hidden border-b">
          <Particles
            className="absolute h-full w-full"
            size={0.6}
            vx={0.01}
            vy={0.05}
          />

          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 px-4 py-8 @min-[600px]/top:grid-cols-12">
            <DailyGamesCard className="@min-[600px]/top:col-span-7" />
            <HexGamesCard className="@min-[600px]/top:col-span-5" />
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-6xl px-4">
          <VaultsAlert />
        </div>
        <div className="@container/bot mx-auto w-full max-w-5xl space-y-8 px-4 py-8">
          <h3>All Games</h3>
          <div className="grid grid-cols-1 gap-4 @min-[600px]/bot:grid-cols-2">
            {allGames.map((config) => (
              <GameCard key={config.id} {...config} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
