"use client";

import { cn } from "@/lib/utils";
import { formatShortDuration } from "@/utils/time";
import { Duration } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

interface Game {
  href: string;
  icon: string;
  name: string;
  className?: string;
}

interface GameCountdownCardProps {
  games: Game[];
  countdown: () => Duration;
  className?: string;
}

export default function GameCountdownCard({
  games,
  countdown,
  className,
}: GameCountdownCardProps) {
  const [timeLeft, setTimeLeft] = useState(countdown());

  useInterval(() => {
    setTimeLeft(countdown());
  }, 1000);

  return (
    <div
      className={cn(
        "from-background/20 to-muted/10 flex flex-col rounded-lg border bg-linear-to-br p-4 text-xl backdrop-blur-xs",
        className
      )}
    >
      <span>
        Ends in <b suppressHydrationWarning>{formatShortDuration(timeLeft)}</b>
      </span>
      <div className="mx-auto mt-5 flex w-full max-w-[400px] justify-center gap-4">
        {games.map(({ href, icon, name, className }) => (
          <Link
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-md p-4",
              className
            )}
            key={name}
            href={href}
          >
            <div className="h-[60px] w-[60px]">
              <Image src={icon} alt={`${name} Logo`} width={60} height={60} />
            </div>
            <span className="text-center text-sm font-bold tracking-wider uppercase">
              {name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
