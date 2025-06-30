import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { VaultIcon } from "lucide-react";
import Image from "next/image";
import { GameSettings } from "../play/types";
import HoverPrefetchLink from "@/components/shared/hover-prefetch-link";

export default async function GameCard({
  className,
  ...gameSettings
}: { className?: string } & Pick<
  GameSettings,
  "icon" | "name" | "blurb" | "colorScheme" | "path"
>) {
  const { icon, name, blurb, colorScheme, path } = gameSettings;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div
      className={cn(
        "from-background/50 flex flex-col gap-4 rounded-lg border bg-linear-to-br to-gray-200 p-4 text-xl backdrop-blur-md dark:to-gray-400/50",
        {
          "from-green-300 to-green-50 dark:from-green-400/70 dark:to-green-700/70":
            colorScheme === "green",
          "from-red-300 to-red-50 dark:from-red-400/70 dark:to-red-700/70":
            colorScheme === "red",
          "from-blue-300 to-blue-50 dark:from-blue-400/70 dark:to-blue-700/70":
            colorScheme === "blue",
          "from-purple-300 to-purple-50 dark:from-purple-400/70 dark:to-purple-700/70":
            colorScheme === "purple",
        },
        className
      )}
    >
      <div className="flex flex-1">
        <Image alt={name} src={icon} width={64} height={64} />
        <div className="ml-4 flex flex-col">
          <span className="font-semibold">{name}</span>
          <span className="text-base opacity-70">{blurb}</span>
        </div>
      </div>
      <div className="flex w-full gap-3">
        <Button
          asChild
          className={cn("flex-1", {
            "bg-green-500 dark:bg-green-200": colorScheme === "green",
            "bg-red-500 dark:bg-red-200": colorScheme === "red",
            "bg-blue-500 dark:bg-blue-200": colorScheme === "blue",
            "bg-purple-500 dark:bg-purple-200": colorScheme === "purple",
          })}
        >
          <HoverPrefetchLink href={`/play${path}`}>Play Game</HoverPrefetchLink>
        </Button>
        {data.user && (
          <Button className="flex-1" variant="outline" asChild>
            <HoverPrefetchLink href={`/play${path}/vault`}>
              <VaultIcon className="mr-1 size-5" />
              Vault
            </HoverPrefetchLink>
          </Button>
        )}
      </div>
    </div>
  );
}
