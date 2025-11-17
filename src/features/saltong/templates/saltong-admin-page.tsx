"use client";

import { ComponentProps, useMemo } from "react";
import { SaltongMode } from "../types";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeftIcon } from "lucide-react";
import { useDraftRounds, useGetSaltongRecentRounds } from "../hooks/admin";
import { SALTONG_CONFIG } from "../config";
import { useDictionary } from "@/features/dictionary/hooks";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import Link from "next/link";
import { RecentRoundsTable } from "../components/admin/recent-rounds-table";
import { GeneratorCard } from "../components/admin/generator-card";
import { DraftRoundsTable } from "../components/admin/draft-rounds-table";
import { ADMIN_CONSTANTS } from "../constants";
import { format } from "date-fns";

type Props = {
  mode: SaltongMode;
};

export default function SaltongAdminPage({ mode }: Props) {
  const { data: recentRounds = [], isLoading } = useGetSaltongRecentRounds(
    mode,
    ADMIN_CONSTANTS.MAX_RECENT_ROUNDS
  );

  const config = SALTONG_CONFIG.modes[mode];
  const wordLen = config.wordLen;

  const { dict: dictionary, isLoading: isDictLoading } = useDictionary(wordLen);

  const recentWords = useMemo(
    () => new Set(recentRounds.map((r) => r.word.toLowerCase())),
    [recentRounds]
  );

  const lastDate = useMemo(() => {
    return recentRounds.length
      ? recentRounds.reduce((max, r) => (r.date > max ? r.date : max), "")
      : format(new Date(), "yyyy-MM-dd");
  }, [recentRounds]);

  const nextRoundId = useMemo(() => {
    return recentRounds.length
      ? Math.max(...recentRounds.map((r) => r.roundId)) + 1
      : 1;
  }, [recentRounds]);

  const {
    drafts,
    isGenerating,
    isSubmitting,
    generateDrafts,
    regenerateWord,
    clearDrafts,
    submitDrafts,
  } = useDraftRounds({
    mode,
    dictionary,
    recentWords,
    lastDate,
    nextRoundId,
  });

  if (isLoading || isDictLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center md:min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading dictionary and rounds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar
        colorScheme={
          config.colorScheme as ComponentProps<typeof Navbar>["colorScheme"]
        }
      >
        <NavbarBrand
          colorScheme={
            config.colorScheme as ComponentProps<typeof Navbar>["colorScheme"]
          }
          icon={config.icon}
          name={config.displayName}
          boxed="ADMIN"
          href="/"
        />

        <div className="flex gap-1.5">
          <Link href="/admin">
            <Button>
              <ArrowLeftIcon /> Back
            </Button>
          </Link>
        </div>
      </Navbar>
      <div className="mx-auto flex h-[calc(100vh-55px)] w-full max-w-5xl p-4 lg:overflow-hidden">
        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[auto_1fr]">
          {/* Recent Rounds Section */}
          <RecentRoundsTable rounds={recentRounds} />

          {/* Generate & Draft Rounds Section */}
          <div className="flex min-h-0 flex-col gap-4">
            {/* Generator Card */}
            <GeneratorCard
              isGenerating={isGenerating}
              isDictLoading={isDictLoading}
              onGenerate={generateDrafts}
            />

            {/* Draft Rounds Card */}
            <DraftRoundsTable
              drafts={drafts}
              lastDate={lastDate}
              nextRoundId={nextRoundId}
              isSubmitting={isSubmitting}
              onRegenerateWord={regenerateWord}
              onClearAll={clearDrafts}
              onSubmit={submitDrafts}
            />
          </div>
        </div>
      </div>
    </>
  );
}
