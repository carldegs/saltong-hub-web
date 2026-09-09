import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayIcon, VaultIcon } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import NavbarUser from "@/components/shared/navbar-user";
import { playPageBackgroundVariants } from "@/components/shared/play-page-background";
import { Button } from "@/components/ui/button";
import { HOW_TO_PLAY_INTROS } from "@/features/game-registry/how-to-play-copy";
import {
  GAME_GUIDES,
  getGameGuide,
  type GameGuide,
} from "@/features/game-guides/config";
import {
  MathinikExampleBoard,
  SaltongExampleTiles,
} from "@/features/game-guides/guide-visuals";
import { HexGuideVisual } from "@/features/game-guides/hex-guide-visual";
import { GameGuidePlayButton } from "@/features/game-guides/game-guide-play-button";
import { HEX_HOW_TO_PLAY_COPY } from "@/features/hex/how-to-play-copy";
import { MathinikExampleEquation } from "@/features/mathinik/components/how-to-play-dialog";
import { getSaltongHowToPlayContent } from "@/features/saltong/how-to-play-content";
import type { SaltongMode } from "@/features/saltong/types";
import {
  SudokuExampleBoard,
  SudokuSettingsTable,
} from "@/features/sudoku/components/sudoku-how-to-play";
import { canonicalUrl, pageIndexingMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

const SALTONG_MODE_BY_SLUG = {
  saltong: "classic",
  mini: "mini",
  max: "max",
} as const satisfies Record<"saltong" | "mini" | "max", SaltongMode>;

const SUDOKU_TIPS = [
  "Tap a cell, then select a number.",
  "Rows, columns, and blocks cannot repeat a number.",
  "Use Notes to mark possible numbers when a cell has several options.",
  "If you got stuck, use the hint button to help you solve the puzzle!",
] as const;

const MATHINIK_RULES = [
  "Each number can only be used once.",
  "Only positive whole numbers are allowed.",
  "Division only works when there is no remainder. You cannot do 5 ÷ 2.",
] as const;

type Props = { params: Promise<{ game: string }> };

export function generateStaticParams() {
  return GAME_GUIDES.map((guide) => ({ game: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const guide = getGameGuide(game);

  if (!guide) return {};

  const title = `How to Play ${guide.name}`;
  const description = `Learn the rules, examples, and tips for ${guide.name}.`;

  return {
    title,
    description,
    ...pageIndexingMetadata(guide.path, true),
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl(guide.path),
    },
  };
}

function GuideNavbar({ guide }: { guide: GameGuide }) {
  return (
    <Navbar colorScheme={guide.colorScheme} hideUserDropdown>
      <NavbarBrand
        colorScheme={guide.colorScheme}
        title={guide.navTitle}
        subtitle={guide.navSubtitle}
        icon={guide.icon}
        href="/"
        prefetch={false}
      />
      <div className="flex gap-1.5">
        <Button asChild variant="outline">
          <Link href={guide.playPath} prefetch={false}>
            <PlayIcon />
            Play
          </Link>
        </Button>
        <Button asChild variant="outline" size="respIcon">
          <Link href={guide.vaultPath} prefetch={false} aria-label="Open Vault">
            <VaultIcon />
            <span className="hidden md:block">Vault</span>
          </Link>
        </Button>
        <NavbarUser />
      </div>
    </Navbar>
  );
}

function GuideList({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <div>
      <h2 className="text-base font-semibold">{title}</h2>
      <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function GuideFrame({
  title,
  intro,
  visual,
  guide,
  children,
}: {
  title: string;
  intro: string;
  visual?: React.ReactNode;
  guide: GameGuide;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.8fr)] lg:items-start">
      <article className="bg-background/65 order-1 space-y-6 rounded-2xl border p-5 shadow-sm sm:p-8">
        <header>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            {title}
          </h1>
          <p className="text-muted-foreground mt-3 leading-relaxed">{intro}</p>
        </header>
        <div className="text-muted-foreground space-y-5 leading-relaxed">
          {children}
        </div>
        <GameGuidePlayButton guide={guide} />
      </article>
      {visual && (
        <aside className="order-2 flex justify-center lg:sticky lg:top-20">
          {visual}
        </aside>
      )}
    </main>
  );
}

function SaltongGuide({
  guide,
  mode,
}: {
  guide: GameGuide;
  mode: SaltongMode;
}) {
  const { intro, wordLen, examples } = getSaltongHowToPlayContent(mode);

  return (
    <GuideFrame
      title="How to Play"
      intro={intro}
      guide={guide}
      visual={
        <div className="space-y-5">
          {examples.map((example) => (
            <div key={example.word}>
              <SaltongExampleTiles
                word={example.word}
                statuses={example.statuses}
              />
              <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed">
                {example.description}
              </p>
            </div>
          ))}
        </div>
      }
    >
      <p>
        Each guess must be a valid {wordLen}-letter word—press Enter to submit.
        Tile colors show how close your guess was to the word.
      </p>
      <p>A new word is available each day.</p>
    </GuideFrame>
  );
}

function HexGuide({ guide }: { guide: GameGuide }) {
  return (
    <GuideFrame
      title="How to Play Hex"
      intro={HOW_TO_PLAY_INTROS.hex}
      guide={guide}
      visual={<HexGuideVisual />}
    >
      <GuideList title="How to play" items={HEX_HOW_TO_PLAY_COPY.rules} />
      <GuideList title="Earning points" items={HEX_HOW_TO_PLAY_COPY.scoring} />
      <p className="text-muted-foreground text-sm leading-relaxed">
        {HEX_HOW_TO_PLAY_COPY.pangramExplanation}
      </p>
    </GuideFrame>
  );
}

function SudokuGuide({ guide }: { guide: GameGuide }) {
  return (
    <GuideFrame
      title="How to Play Sudoku"
      intro={HOW_TO_PLAY_INTROS.sudoku}
      guide={guide}
      visual={<SudokuExampleBoard />}
    >
      <p>
        Each row, column, and 3x3 block must contain the numbers 1-9, with no
        repeats.
      </p>
      <GuideList title="Tips" items={SUDOKU_TIPS} />
      <section>
        <h2 className="text-base font-semibold">Settings</h2>
        <div className="mt-3">
          <SudokuSettingsTable />
        </div>
      </section>
    </GuideFrame>
  );
}

function MathinikGuide({ guide }: { guide: GameGuide }) {
  return (
    <GuideFrame
      title="How to Play Mathinik"
      intro={HOW_TO_PLAY_INTROS.mathinik}
      guide={guide}
      visual={
        <div className="space-y-4">
          <MathinikExampleBoard />
          <div className="space-y-2">
            <MathinikExampleEquation
              variable="α"
              first={50}
              operator="÷"
              second={5}
              result={10}
            />
            <p className="text-muted-foreground px-1 text-sm leading-relaxed">
              Combining 50 and 5 creates another 10 for the next step.
            </p>
            <MathinikExampleEquation
              variable="β"
              first={10}
              operator="×"
              second={10}
              result={100}
            />
            <MathinikExampleEquation
              variable="γ"
              first={100}
              operator="×"
              second={9}
              result={900}
            />
            <p className="text-muted-foreground px-1 text-sm leading-relaxed">
              Keep 900, then use the remaining 3 and 1 to make 2.
            </p>
            <MathinikExampleEquation
              variable="δ"
              first={3}
              operator="-"
              second={1}
              result={2}
            />
            <MathinikExampleEquation
              variable="ε"
              first={900}
              operator="-"
              second={2}
              result={898}
              emphatic
            />
          </div>
        </div>
      }
    >
      <GuideList title="Rules" items={MATHINIK_RULES} />
    </GuideFrame>
  );
}

export default async function GameHowToPlayPage({ params }: Props) {
  const { game } = await params;
  const guide = getGameGuide(game);

  if (!guide) notFound();

  const content =
    game in SALTONG_MODE_BY_SLUG ? (
      <SaltongGuide
        guide={guide}
        mode={SALTONG_MODE_BY_SLUG[game as keyof typeof SALTONG_MODE_BY_SLUG]}
      />
    ) : game === "hex" ? (
      <HexGuide guide={guide} />
    ) : game === "sudoku" ? (
      <SudokuGuide guide={guide} />
    ) : (
      <MathinikGuide guide={guide} />
    );

  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_1fr]">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "How to Play", path: "/how-to-play" },
          { name: guide.name, path: guide.path },
        ])}
      />
      <GuideNavbar guide={guide} />
      <div
        className={cn(
          playPageBackgroundVariants({ colorScheme: guide.colorScheme }),
          "min-h-0"
        )}
      >
        {content}
      </div>
    </div>
  );
}
