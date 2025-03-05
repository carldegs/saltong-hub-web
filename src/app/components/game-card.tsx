import { cn } from "@/lib/utils";
import { GameConfig } from "../play/(saltong)/types";
import { Button } from "@/components/ui/button";
import { ArchiveIcon, LockKeyholeIcon } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function GameCard({
  className,
  ...gameConfig
}: { className?: string } & Pick<
  GameConfig,
  "icon" | "subtitle" | "blurb" | "colorScheme"
> & { mode: GameConfig["mode"] | "hex" }) {
  const { icon, subtitle, blurb, mode } = gameConfig;
  const supabase = await createClient();
  // safe to use here because archives page uses getUser
  const { data } = await supabase.auth.getSession();

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border bg-gradient-to-br from-background/50 to-gray-200 p-4 text-xl backdrop-blur-md dark:to-gray-400/50",
        {
          "from-green-300 to-green-50 dark:from-green-400/70 dark:to-green-700/70":
            gameConfig.colorScheme === "green",
          "from-red-300 to-red-50 dark:from-red-400/70 dark:to-red-700/70":
            gameConfig.colorScheme === "red",
          "from-blue-300 to-blue-50 dark:from-blue-400/70 dark:to-blue-700/70":
            gameConfig.colorScheme === "blue",
          "from-purple-300 to-purple-50 dark:from-purple-400/70 dark:to-purple-700/70":
            gameConfig.colorScheme === "purple",
        },
        className
      )}
    >
      <div className="flex">
        <img src={icon} className="size-16" />
        <div className="ml-4 flex flex-col">
          <span className="font-semibold">Saltong {subtitle}</span>
          <span className="text-base opacity-70">{blurb}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <Button
          asChild
          className={cn("w-full", {
            "bg-green-500 dark:bg-green-200":
              gameConfig.colorScheme === "green",
            "bg-red-500 dark:bg-red-200": gameConfig.colorScheme === "red",
            "bg-blue-500 dark:bg-blue-200": gameConfig.colorScheme === "blue",
            "bg-purple-500 dark:bg-purple-200":
              gameConfig.colorScheme === "purple",
          })}
        >
          <Link href={`/play/${mode !== "main" ? mode : ""}`}>Play Game</Link>
        </Button>
        {data.session ? (
          <Button className="w-full" variant="outline" asChild>
            <Link href={`/play/${mode !== "main" ? mode : ""}/archives`}>
              <ArchiveIcon className="mr-1 size-5" />
              Archives
            </Link>
          </Button>
        ) : (
          <Button disabled variant="outline" className="w-full">
            <div className="flex w-full flex-col items-center">
              <span className="flex items-center">
                <LockKeyholeIcon className="mr-1 size-5" /> Archives
              </span>
              <span className="text-xs">(Login to Access)</span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}
