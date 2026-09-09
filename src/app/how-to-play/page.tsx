import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HomeNavbarBrand from "@/app/components/home-navbar-brand";
import { JsonLd } from "@/components/seo/json-ld";
import { Navbar } from "@/components/shared/navbar";
import { GAME_GUIDES } from "@/features/game-guides/config";
import { canonicalUrl, pageIndexingMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "How to Play Saltong Hub Games",
  description:
    "Learn how to play Saltong, Saltong Mini, Saltong Max, Hex, Sudoku, and Mathinik.",
  ...pageIndexingMetadata("/how-to-play", true),
  openGraph: {
    title: "How to Play Saltong Hub Games",
    description: "Learn the rules for every game and puzzle on Saltong Hub.",
    type: "website",
    url: canonicalUrl("/how-to-play"),
  },
};

export default function HowToPlayPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "How to Play", path: "/how-to-play" },
        ])}
      />
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How to Play Saltong Hub Games
          </h1>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Choose a game to see its rules and visual examples.
          </p>
        </header>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GAME_GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={guide.path}
              className="bg-card hover:bg-muted/60 flex items-center gap-4 rounded-xl border p-4 transition-colors"
            >
              <Image src={guide.icon} alt="" width={44} height={44} />
              <span className="font-semibold">{guide.name}</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
