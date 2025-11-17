import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DifficultyBadgeProps {
  score?: number;
  explanation?: string;
}

export function DifficultyBadge({ score, explanation }: DifficultyBadgeProps) {
  if (score === undefined) {
    return (
      <Badge variant="outline" className="gap-1.5 opacity-50">
        <DifficultyBars score={undefined} />
        <span className="text-xs font-medium">-/5</span>
      </Badge>
    );
  }

  const variant = getDifficultyVariant(score);
  const className = getDifficultyClassName(score);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Badge variant={variant} className={`gap-1.5 ${className}`}>
              <DifficultyBars score={score} />
              <span className="text-xs font-medium">{score}/5</span>
            </Badge>
          </div>
        </TooltipTrigger>
        {explanation && (
          <TooltipContent side="left" className="max-w-xs">
            <p className="text-xs">{explanation}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

function DifficultyBars({ score }: { score?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={idx}
          className={`h-2 w-1 rounded-full ${
            score !== undefined && idx < score
              ? "bg-current"
              : "bg-current opacity-20"
          }`}
        />
      ))}
    </div>
  );
}

function getDifficultyVariant(
  score: number
): "destructive" | "default" | "secondary" | "outline" {
  if (score === 0) return "destructive";
  if (score <= 2) return "default";
  if (score === 3) return "secondary";
  return "outline";
}

function getDifficultyClassName(score: number): string {
  if (score === 0) return "bg-red-500 hover:bg-red-600";
  if (score <= 2) return "bg-green-500 hover:bg-green-600";
  if (score === 3) return "text-foreground bg-yellow-500 hover:bg-yellow-600";
  return "border-orange-500 bg-orange-500 text-white hover:bg-orange-600";
}
