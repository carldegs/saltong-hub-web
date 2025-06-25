"use client";

import { RootCredenzaProps } from "@/components/ui/credenza";
import { useMemo } from "react";
import useHexScores from "../hooks/useHexScores";
import useHexAnswer from "../hooks/useHexAnswer";
import { HexRound } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { VaultIcon, InfoIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { isPangram } from "../utils";
import ShareButtons from "@/components/shared/share-buttons";

const OTHER_GAMES_LIST = [
  {
    mode: "vault",
    name: "Hex Vault",
    icon: "/hex.svg",
    href: "/play/hex/vault",
  },
  {
    mode: "main",
    name: "Saltong",
    icon: "/main.svg",
    href: "/play",
  },
  {
    mode: "max",
    name: "Saltong Max",
    icon: "/max.svg",
    href: "/play/max",
  },
  {
    mode: "mini",
    name: "Saltong Mini",
    icon: "/mini.svg",
    href: "/play/mini",
  },
];

function ResultsDialogComponent({
  open,
  onOpenChange,
  isRevealed,
  onRevealAnswers,
  guessedWords,
  wordList,
  round,
}: Omit<RootCredenzaProps, "children"> & {
  guessedWords: string[];
  wordList: string[];
  round: HexRound;
  isRevealed: boolean;
  onRevealAnswers: () => void;
}) {
  const { score, rank, maxScore, rankScoreMap, numPangrams } = useHexScores({
    guessedWords,
    wordList,
  });

  const topScore = useMemo(
    () => rankScoreMap[rankScoreMap.length - 1]?.score ?? 0,
    [rankScoreMap]
  );
  const topRank = useMemo(
    () => rankScoreMap[rankScoreMap.length - 1]?.name ?? "",
    [rankScoreMap]
  );

  // Reverse the rankScoreMap so that highest rank is first
  const reversedRankScoreMap = useMemo(
    () => [...rankScoreMap].reverse(),
    [rankScoreMap]
  );

  const userGuessedAllWords = guessedWords.length === wordList.length;

  const shareText = useMemo(() => {
    const rankNum = rankScoreMap.findIndex((r) => r.name === rank?.name) + 1;

    return `Saltong Hex ${round.gameId}\n\n${rank?.icon} ${rank?.name?.toUpperCase()}\n🏅${rankNum} 🔢${score} 📖${guessedWords.length}\n\n${window.location.href}`;
  }, [
    guessedWords.length,
    rank?.icon,
    rank?.name,
    rankScoreMap,
    round.gameId,
    score,
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-full overflow-y-auto sm:max-h-[90dvh]">
        <DialogHeader className="px-0">
          <DialogTitle className="mb-2 border-0 font-bold">Stats</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="progress">Your Progress</TabsTrigger>
            <TabsTrigger value="answer">Answers</TabsTrigger>
          </TabsList>
          <TabsContent value="share">
            <div className="flex flex-col gap-3 md:px-0">
              <div className="bg-accent flex flex-col items-center justify-center gap-6 rounded-md px-4 py-8">
                <p className="flex size-12 items-center justify-center rounded-full text-center text-2xl font-bold tracking-widest whitespace-nowrap md:text-3xl">
                  {rank?.icon}
                  {rank?.name.toUpperCase()}
                </p>

                <div className="flex w-full flex-row justify-evenly gap-1.5">
                  <div className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="items-center text-3xl">{score}</span>
                    <span className="text-sm font-bold tracking-widest">
                      SCORE
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-3xl">{guessedWords.length}</span>
                    <span className="text-center text-sm font-bold tracking-widest">
                      WORDS
                    </span>
                  </div>
                </div>
              </div>

              <ShareButtons title="Saltong Hex" message={shareText} />

              <span className="text-center text-sm font-bold tracking-wider">
                PLAY OTHER GAMES
              </span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {OTHER_GAMES_LIST.map(({ href, mode, name, icon }) => (
                  <Link
                    href={href}
                    key={mode}
                    className="min-w-[90px] grow"
                    onClick={() => {
                      onOpenChange?.(false);
                    }}
                  >
                    <Card className="hover:bg-muted h-full p-0 shadow-none">
                      <CardContent className="flex flex-col items-center justify-center p-3">
                        <div className="relative mb-2 h-[36px] sm:mb-1">
                          <Image src={icon} alt={mode} width={36} height={36} />
                          {mode === "vault" && (
                            <div className="absolute -top-2 -right-3 rounded-full bg-teal-700 p-1">
                              <VaultIcon className="size-4 text-teal-50" />
                            </div>
                          )}
                        </div>
                        <span className="w-full text-center text-sm font-bold tracking-wider uppercase">
                          {name}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="progress">
            <p className="text-muted-foreground my-3 text-center text-sm">
              You need <b>{topScore}</b> out of {maxScore} points to get{" "}
              <b>{topRank?.toUpperCase()}</b>
            </p>
            <Table className="mx-auto max-w-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6">Rank</TableHead>
                  <TableHead className="px-6 text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reversedRankScoreMap.map((rankData) => (
                  <TableRow
                    key={rankData.name}
                    className={cn({
                      "bg-purple-300/30 font-bold dark:bg-purple-700/30":
                        rank?.name === rankData.name,
                    })}
                  >
                    <TableCell className="px-6 capitalize">
                      {rankData.icon} {rankData.name}
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      {rankData.score}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Alert className="bg-muted mt-1">
              <InfoIcon className="size-4" />
              <AlertTitle>How to earn points</AlertTitle>
              <AlertDescription>
                <span>
                  Each 4-letter word is worth 1 point, while longer words earn
                  points equal to their length (e.g., DUWAG is worth 5 points,
                  MANONG is worth 6 points, and so on).
                </span>
                <span>
                  If a word is a pangram—meaning it uses all the given letters
                  at least once—an additional 7 points is added to its score.
                  This round has {numPangrams} pangram
                  {numPangrams !== 1 ? "s" : ""}.
                </span>
              </AlertDescription>
            </Alert>
          </TabsContent>
          <TabsContent value="answer">
            {!userGuessedAllWords && !isRevealed ? (
              <Alert className="mt-1 border-yellow-300 bg-yellow-400/40">
                <InfoIcon className="size-4" />
                <AlertTitle className="font-bold text-yellow-900 dark:text-yellow-100">
                  WARNING
                </AlertTitle>
                <AlertDescription className="text-yellow-900 dark:text-yellow-100">
                  <span>
                    Answers will be revealed only after you&apos;ve guessed all
                    the words. If you choose to reveal the answers now,{" "}
                    <b>
                      you won&apos;t be able to enter any more words or continue
                      playing this round.
                    </b>{" "}
                    Click the button below to proceed.
                  </span>
                </AlertDescription>
                <div></div>
                <div className="mt-6 flex w-full flex-col justify-end gap-2 md:flex-row md:gap-4">
                  <Button
                    onClick={() => {
                      onRevealAnswers();
                    }}
                  >
                    Show Answers
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onOpenChange?.(false);
                    }}
                  >
                    Continue Playing
                  </Button>
                </div>
              </Alert>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3">
                {wordList.map((word) => (
                  <div key={word} className="flex flex-row gap-1">
                    <span
                      className={cn("text-muted-foreground", {
                        "text-primary font-bold": guessedWords.includes(word),
                      })}
                    >
                      {word}
                    </span>
                    {isPangram(word) && (
                      <StarIcon className="size-4 text-yellow-500 dark:text-yellow-400" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default function ResultsDialog({
  open,
  onOpenChange,
  round = {} as HexRound,
}: Omit<RootCredenzaProps, "children"> & {
  gameDate: string;
  round: HexRound;
}) {
  const { words, date } = round;
  const parsedWords = useMemo(() => words?.split(",") ?? [], [words]);
  const [playerAnswer, setPlayerAnswer] = useHexAnswer(date);

  if (open) {
    return (
      <ResultsDialogComponent
        open={open}
        onOpenChange={onOpenChange}
        guessedWords={playerAnswer.guessedWords}
        wordList={parsedWords}
        round={round}
        isRevealed={!!playerAnswer.isRevealed}
        onRevealAnswers={() => {
          setPlayerAnswer((prev) => ({
            ...prev,
            isRevealed: true,
          }));
        }}
      />
    );
  }

  return null;
}
