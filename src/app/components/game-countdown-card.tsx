import { cn } from "@/lib/utils";
import { Duration } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { CountdownTimer } from "./countdown-timer";

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
  return (
    <div
      className={cn(
        "from-background/20 to-muted/10 flex flex-col rounded-lg border bg-linear-to-br p-4 text-xl backdrop-blur-xs",
        className
      )}
    >
      <CountdownTimer countdown={countdown} />
      <div className="mx-auto mt-5 flex w-full max-w-[400px] justify-center gap-4">
        {games.map(({ href, icon, name, className }) => (
          <Link
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-md p-4",
              className
            )}
            key={name}
            href={href}
            prefetch={false}
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
