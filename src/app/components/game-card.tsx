import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { VaultIcon } from "lucide-react";
import Image from "next/image";
import HoverPrefetchLink from "@/components/shared/hover-prefetch-link";
import { BaseConfig } from "@/features/game-registry/types";

export default async function GameCard({
  className,
  ...gameSettings
}: { className?: string } & BaseConfig) {
  const { icon, displayName, blurb, colorScheme, path } = gameSettings;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div
      className={cn(
        "relative flex transform-gpu flex-col gap-4 rounded-2xl border p-4 text-xl shadow-xl backdrop-blur-md transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-2xl",
        {
          "border-saltong-green/30 bg-saltong-green/15":
            colorScheme === "green",

          "border-saltong-red/30 bg-saltong-red/15": colorScheme === "red",

          "border-saltong-blue/30 bg-saltong-blue/15": colorScheme === "blue",

          "border-saltong-purple/30 bg-saltong-purple/15":
            colorScheme === "purple",
        },
        className
      )}
    >
      <div className="flex flex-1">
        <Image alt={displayName} src={icon} width={64} height={64} />
        <div className="ml-4 flex flex-col">
          <span className="font-semibold">{displayName}</span>
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
