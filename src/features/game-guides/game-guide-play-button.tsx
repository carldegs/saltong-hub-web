import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GameGuide } from "./config";

const CTA_COLOR_CLASSES: Record<GameGuide["colorScheme"], string> = {
  green: "bg-saltong-green-500 hover:bg-saltong-green-600 text-white",
  blue: "bg-saltong-blue-500 hover:bg-saltong-blue-600 text-white",
  red: "bg-saltong-red-500 hover:bg-saltong-red-600 text-white",
  purple: "bg-saltong-purple-500 hover:bg-saltong-purple-600 text-white",
  orange: "bg-saltong-orange-500 hover:bg-saltong-orange-600 text-white",
  teal: "bg-saltong-teal-500 hover:bg-saltong-teal-600 text-white",
};

export function GameGuidePlayButton({ guide }: { guide: GameGuide }) {
  return (
    <Button
      asChild
      className={cn(
        "mt-2 w-full sm:w-auto",
        CTA_COLOR_CLASSES[guide.colorScheme]
      )}
    >
      <Link href={guide.playPath} prefetch={false}>
        <Image src={guide.icon} alt="" width={20} height={20} />
        Play {guide.name} Now
      </Link>
    </Button>
  );
}
