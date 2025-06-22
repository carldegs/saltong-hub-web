import { cn } from "@/lib/utils";
import { GameConfig } from "../play/(saltong)/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArchiveIcon } from "lucide-react";
import Image from "next/image";

export default async function GameCard({
  className,
  ...gameConfig
}: { className?: string } & Pick<
  GameConfig,
  "icon" | "subtitle" | "blurb" | "colorScheme"
> & { mode: GameConfig["mode"] | "hex" }) {
  const { icon, subtitle, blurb, mode } = gameConfig;
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  return (
    <div
      className={cn(
        "from-background/50 flex flex-col gap-4 rounded-lg border bg-linear-to-br to-gray-200 p-4 text-xl backdrop-blur-md dark:to-gray-400/50",
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
      <div className="flex flex-1">
        <Image alt={`Saltong ${subtitle}`} src={icon} width={64} height={64} />
        <div className="ml-4 flex flex-col">
          <span className="font-semibold">Saltong {subtitle}</span>
          <span className="text-base opacity-70">{blurb}</span>
        </div>
      </div>
      <div className="flex w-full gap-3">
        <Button
          asChild
          className={cn("flex-1", {
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
        {data.session && (
          <Button className="flex-1" variant="outline" asChild>
            <Link href={`/play/${mode !== "main" ? mode : ""}/archives`}>
              <ArchiveIcon className="mr-1 size-5" />
              Archives
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
