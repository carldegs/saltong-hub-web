"use client";

import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  Sheet,
} from "@/components/ui/sheet";
import { useModalStore } from "@/providers/modal/modal-provider";
import { Button } from "@/components/ui/button";
import {
  SaltongMode,
  SaltongRound,
  SaltongUserRound,
  SaltongUserStats,
} from "../../types";
import { useEffect } from "react";
import { useSaltongUserRound } from "../../hooks/user-round";
import { useSaltongUserStats } from "../../hooks/user-stats";
import ShareButtons from "./share-buttons";
import { triggerFailureConfetti, triggerSuccessConfetti } from "./utils";
import { TimeCard } from "./time-card";
import { TurnCard } from "./turn-card";
import { NavbarBrand } from "@/components/shared/navbar";
import { SALTONG_CONFIG } from "../../config";
import GroupLeaderboardsCard from "./group-leaderboards-card";
import StreakCard from "./streak-card";
import { useQuery } from "@tanstack/react-query";
import { getProfileById } from "@/features/profiles/queries/get-profile";
import { createClient } from "@/lib/supabase/client";
import PlayMoreCard from "./play-more-card";
import ContributeItem from "./contribute-item";

export const RESULTS_MODAL_ID = "results";

export default function ResultsDialog({
  roundData,
  userId = "unauthenticated",
}: {
  roundData: SaltongRound;
  userId?: string;
}) {
  const { mode, date } = roundData;
  const isOpen = useModalStore((state) => state.openModal === RESULTS_MODAL_ID);
  const setOpenModal = useModalStore((state) => state.setOpenModal);
  const { data: profile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const supabase = await createClient();
      const { data } = await getProfileById(supabase, userId || "");
      return data;
    },
    enabled: isOpen && !!userId && userId !== "unauthenticated",
  });

  // TODO: Split up to screens once achievements is setup
  // const [screen, setScreen] = useState<"summary" | "detailed">("summary");
  const { data: userRoundData } = useSaltongUserRound({
    userId,
    mode,
    date,
  });
  const { data: userStats } = useSaltongUserStats({
    userId,
    mode,
  });
  const modeConfig = SALTONG_CONFIG.modes[mode as SaltongMode];

  const handleOpenChange = (open: boolean) => {
    // if (open) {
    //   setScreen("summary");
    // }
    setOpenModal(open ? RESULTS_MODAL_ID : null);
  };

  useEffect(() => {
    if (isOpen) {
      if (userRoundData?.isCorrect) {
        triggerSuccessConfetti();
      } else {
        triggerFailureConfetti();
      }
    }
  }, [isOpen, userRoundData?.isCorrect]);

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="mx-auto my-34 mb-6 w-full max-w-sm lg:mt-22 lg:mb-18 lg:max-w-lg"
        >
          <b>View Results</b>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="no-scrollbar grid h-dvh grid-rows-[1fr_auto] overflow-y-auto p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Results</SheetTitle>
        </SheetHeader>
        <div className="no-scrollbar relative mx-auto w-full max-w-lg overflow-y-auto px-4 pt-6">
          <NavbarBrand
            colorScheme={modeConfig.colorScheme}
            title={modeConfig.displayName}
            icon={modeConfig.icon}
            hideMenu
            forceLarge
            boxed={roundData.roundId ? `#${roundData.roundId}` : undefined}
            className="mb-8"
          />
          {userRoundData && isOpen && (
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <TimeCard
                startTime={userRoundData.startedAt}
                endTime={userRoundData.endedAt!}
                theme={modeConfig.colorScheme}
              />
              <TurnCard
                solvedTurn={userRoundData.solvedTurn}
                winTurns={userStats?.winTurns}
                theme={modeConfig.colorScheme}
              />
            </div>
          )}

          <div className="flex w-full flex-col gap-4 py-6">
            <GroupLeaderboardsCard
              userId={userId}
              mode={roundData.mode}
              date={roundData.date}
            />
            <StreakCard
              userStats={userStats!}
              username={profile?.username ?? "unknown"}
            />

            <PlayMoreCard mode={mode as SaltongMode} />

            <ContributeItem />
          </div>

          {/* {screen === "summary" && (
            <SummaryScreen
              roundData={roundData}
              userRoundData={userRoundData!}
              userStats={userStats!}
            />
          )} */}
          <div className="to-background pointer-events-none sticky bottom-0 h-10 w-full bg-gradient-to-b from-transparent" />
        </div>
        <SheetFooter className="mx-auto w-full max-w-lg flex-col gap-4 px-4 pt-2 pb-6 sm:flex-col">
          <ShareButtons
            roundData={roundData}
            userRoundData={userRoundData as SaltongUserRound}
            userStats={userStats as SaltongUserStats}
          />
          {/* {screen === "summary" && (
            <Button
              className="h-auto w-full py-3 font-bold"
              variant="outline"
              size="lg"
              onClick={() => {
                setScreen("detailed");
              }}
            >
              Next <ArrowRightIcon />
            </Button>
          )}
          {screen === "detailed" && (
            <Button
              className="h-auto w-full py-3 font-bold"
              variant="outline"
              size="lg"
              onClick={() => {
                setScreen("summary");
              }}
            >
              <ArrowLeftIcon /> Back
            </Button>
          )} */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
