import React from "react";
import { MemberRow } from "@/components/shared/member-row";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import {
  HexLeaderboardEntry,
  SaltongLeaderboardEntry,
} from "../queries/get-leaderboards";

interface GroupLeaderboardEntryProps {
  data: HexLeaderboardEntry | SaltongLeaderboardEntry;
  mode: string;
}

export function GroupLeaderboardEntry({
  data,
  mode,
}: GroupLeaderboardEntryProps) {
  const isHex = mode === "hex";
  const hexData = data as HexLeaderboardEntry;
  const saltongData = data as SaltongLeaderboardEntry;

  return (
    <React.Fragment>
      <MemberRow
        avatarUrl={data.avatarUrl}
        displayName={`${data.displayName} ${isHex && hexData.isTopRank ? "⚡" : ""}`}
        username={data.username}
        faded={
          isHex
            ? !hexData.liveScore && !hexData.vaultScore
            : !saltongData.endedAt
        }
      />
      <div className="flex items-center justify-end">
        {isHex ? (
          <>
            <div
              className={cn(
                "bg-muted text-muted-foreground flex items-center justify-center rounded-lg px-3 py-1.5 text-center text-lg leading-none font-bold",
                {
                  "bg-saltong-purple-100 text-purple-800":
                    hexData.liveScore > 0,
                  "bg-saltong-purple-50 text-purple-800":
                    hexData.vaultScore > 0 && !hexData.liveScore,
                }
              )}
            >
              {hexData.liveScore ?? hexData.vaultScore ?? "-"}
              {hexData.vaultScore > 0 && !hexData.liveScore ? "*" : ""}
            </div>
          </>
        ) : (
          <div
            className={cn(
              "bg-muted text-muted-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-center text-lg leading-none font-bold",
              {
                "bg-saltong-green-100 text-green-800": saltongData.solvedTurn,
                "bg-saltong-red-100 text-red-800":
                  saltongData.endedAt && !saltongData.solvedTurn,
              }
            )}
          >
            {saltongData.solvedTurn && saltongData.solvedTurn}
            {!saltongData.solvedTurn && saltongData.endedAt && (
              <XIcon className="size-6" />
            )}
            {!saltongData.endedAt && "–"}
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
