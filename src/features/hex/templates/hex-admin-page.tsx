"use client";

import { ComponentProps, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeftIcon } from "lucide-react";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import Link from "next/link";
import { format } from "date-fns";
import { HEX_CONFIG } from "../config";
import { useGetHexRecentRounds } from "../hooks/recent-rounds";
import {
  useHexLookupTableData,
  useHexLookupTableStatus,
} from "../hooks/hex-lookup-table";
import { buildCharsetMask } from "../utils";
import { HexWordsModal } from "../components/hex-words-modal";
import { useDictionary } from "@/features/dictionary/hooks";
import { RecentRoundsTable } from "../components/admin/recent-rounds-table";
import { LookupTableCard } from "../components/admin/lookup-table-card";
import { DraftRoundsTable } from "../components/admin/draft-rounds-table";
import {
  useDraftRounds,
  getHexRoundData,
  type DraftHexRound,
} from "../hooks/draft-rounds";
import type { HexRound } from "../types";

export default function HexAdminPage() {
  const { data: recentRounds = [], isLoading } = useGetHexRecentRounds(200);
  const { data: hexLookupTable, isLoading: isFetchingHexLookupTable } =
    useHexLookupTableData();
  const {
    metadata,
    isLoadingMetadata,
    regenerate,
    isRegenerating,
    refetchMetadata,
  } = useHexLookupTableStatus();

  // Load all dictionaries for word computation
  const dictionaryLengths = useMemo(() => {
    const lengths: number[] = [];
    for (
      let i = HEX_CONFIG.minWordListLetters;
      i <= HEX_CONFIG.maxWordListLetters;
      i++
    ) {
      lengths.push(i);
    }
    return lengths;
  }, []);
  const { dict: dictionaries, isLoading: isDictLoading } =
    useDictionary(dictionaryLengths);

  const [wordsModalOpen, setWordsModalOpen] = useState(false);
  const [selectedRound, setSelectedRound] = useState<
    DraftHexRound | HexRound | null
  >(null);

  const config = HEX_CONFIG;

  // Get all words from all dictionaries
  const allWords = useMemo(() => {
    if (!dictionaries || typeof dictionaries !== "object") return [];
    return Object.values(dictionaries).flat();
  }, [dictionaries]);

  // Compute complete HexRound data for selected round
  const selectedRoundData = useMemo(() => {
    if (!selectedRound || !allWords.length) return null;
    try {
      // If it's already a complete HexRound, return it
      if ("validWords" in selectedRound && selectedRound.validWords) {
        return selectedRound as HexRound;
      }
      // Otherwise, compute it from DraftHexRound
      return getHexRoundData(selectedRound as DraftHexRound, allWords);
    } catch {
      return null;
    }
  }, [selectedRound, allWords]);

  const lastDate = useMemo(() => {
    return recentRounds.length
      ? recentRounds.reduce(
          (max: string, r) => (r.date > max ? r.date : max),
          ""
        )
      : format(new Date(), "yyyy-MM-dd");
  }, [recentRounds]);

  const nextRoundId = useMemo(() => {
    return recentRounds.length
      ? Math.max(...recentRounds.map((r) => r.roundId)) + 1
      : 1;
  }, [recentRounds]);

  // Filter lookup table to exclude rounds already in recentRounds
  const filteredLookupTable = useMemo(() => {
    if (!hexLookupTable || !Array.isArray(hexLookupTable)) {
      return [];
    }

    const usedCombos = new Set(
      recentRounds
        .map((r) => {
          const wordId =
            r.wordId ?? (r.rootWord ? buildCharsetMask(r.rootWord) : null);
          return wordId !== null ? `${wordId}-${r.centerLetter}` : null;
        })
        .filter((combo): combo is string => combo !== null)
    );

    return hexLookupTable.filter(
      (item) => !usedCombos.has(`${item.wordId}-${item.centerLetter}`)
    );
  }, [hexLookupTable, recentRounds]);

  // Use draft rounds hook
  const {
    drafts,
    isGenerating,
    isSubmitting,
    generateDrafts,
    regenerateAt,
    clearDrafts,
    submitDrafts,
  } = useDraftRounds({
    allWords,
    filteredLookupTable,
    recentRounds,
    lastDate,
    nextRoundId,
  });

  if (isLoading || isFetchingHexLookupTable || isDictLoading) {
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
        hideUserDropdown
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
      <div className="mx-auto flex h-[calc(100vh-55px)] w-full max-w-[90rem] p-4 lg:overflow-hidden">
        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[auto_1fr]">
          <RecentRoundsTable
            rounds={recentRounds}
            onViewWords={(round) => {
              setSelectedRound(round);
              setWordsModalOpen(true);
            }}
          />

          <div className="flex min-h-0 flex-col gap-4">
            <LookupTableCard
              metadata={metadata ?? null}
              isLoadingMetadata={isLoadingMetadata}
              isRegenerating={isRegenerating}
              filteredLookupTable={filteredLookupTable}
              onRegenerate={regenerate}
              onRefetchMetadata={refetchMetadata}
            />

            <DraftRoundsTable
              drafts={drafts}
              isGenerating={isGenerating}
              isSubmitting={isSubmitting}
              onGenerate={generateDrafts}
              onViewWords={(round) => {
                setSelectedRound(round);
                setWordsModalOpen(true);
              }}
              onRegenerateRound={regenerateAt}
              onClearAll={clearDrafts}
              onSubmit={submitDrafts}
            />
          </div>
        </div>
      </div>

      <HexWordsModal
        open={wordsModalOpen}
        onOpenChange={setWordsModalOpen}
        round={selectedRoundData}
        isLoading={isDictLoading}
      />
    </>
  );
}
