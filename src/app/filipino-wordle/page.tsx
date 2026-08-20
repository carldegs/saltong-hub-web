import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HomeNavbarBrand from "@/app/components/home-navbar-brand";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { canonicalUrl, pageIndexingMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { FILIPINO_WORDLE_LANDING_COPY, LANDING_GAMES } from "./copy";
import { LandingStory } from "./landing-story";

const gameButtonStyles = {
  green:
    "border-saltong-green-300 hover:bg-saltong-green-50 dark:hover:bg-saltong-green-950/30",
  blue: "border-saltong-blue-300 hover:bg-saltong-blue-50 dark:hover:bg-saltong-blue-950/30",
  red: "border-saltong-red-300 hover:bg-saltong-red-50 dark:hover:bg-saltong-red-950/30",
  purple:
    "border-saltong-purple-300 hover:bg-saltong-purple-50 dark:hover:bg-saltong-purple-950/30",
} as const;

export const metadata: Metadata = {
  title: { absolute: FILIPINO_WORDLE_LANDING_COPY.title },
  description: FILIPINO_WORDLE_LANDING_COPY.description,
  ...pageIndexingMetadata("/filipino-wordle", true),
  openGraph: {
    title: FILIPINO_WORDLE_LANDING_COPY.title,
    description: FILIPINO_WORDLE_LANDING_COPY.description,
    type: "website",
    url: canonicalUrl("/filipino-wordle"),
  },
};

export default function FilipinoWordlePage() {
  return (
    <>
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {FILIPINO_WORDLE_LANDING_COPY.hero}
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            {FILIPINO_WORDLE_LANDING_COPY.introduction}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {LANDING_GAMES.map((game) => (
              <Button
                key={game.href}
                asChild
                variant="outline"
                className={cn(
                  "bg-background h-20 flex-col gap-2 border text-sm font-bold shadow-none",
                  gameButtonStyles[game.color]
                )}
              >
                <Link href={game.href}>
                  <Image src={game.icon} alt="" width={28} height={28} />
                  {game.name}
                </Link>
              </Button>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t pt-8 text-sm leading-relaxed">
          <h2 className="text-lg font-bold">
            A Filipino and Tagalog word game
          </h2>
          <p className="text-muted-foreground mt-2">
            {FILIPINO_WORDLE_LANDING_COPY.searchCopy}
          </p>
          <LandingStory />
          <p className="text-muted-foreground mt-3 text-xs">
            {FILIPINO_WORDLE_LANDING_COPY.independenceNotice}
          </p>
        </section>
      </main>
    </>
  );
}
