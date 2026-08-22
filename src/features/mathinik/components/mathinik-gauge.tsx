import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, RotateCcwIcon } from "lucide-react";
import { MathinikTargetPentagon } from "./mathinik-display";
import type { BestResult } from "./play-area-types";

export function MathinikGauge({
  target,
  currentResult,
  onReset,
  readOnly,
}: {
  target: number;
  currentResult: BestResult | null;
  onReset: () => void;
  readOnly?: boolean;
}) {
  const currentValue = currentResult?.value;
  const delta = currentValue === undefined ? null : currentValue - target;
  const visibleDelta = delta ?? 0;
  const scaleLimit = Math.floor(Math.max(target / 2, 100));
  const clampedDelta = Math.max(
    -scaleLimit,
    Math.min(scaleLimit, visibleDelta)
  );
  const markerPosition = 50 + (clampedDelta / scaleLimit) * 50;
  const scaleMin = target - scaleLimit;
  const scaleMax = target + scaleLimit;
  const isExact = delta === 0;
  const deltaMagnitude = delta === null ? null : Math.abs(delta);

  return (
    <section>
      <div className="relative pt-12 pb-3">
        <div className="absolute top-0 left-0 z-20">
          <span className="bg-saltong-teal-100 text-saltong-teal-900 dark:bg-saltong-teal-900/55 dark:text-saltong-teal-100 rounded-md px-2 py-1 text-[0.65rem] leading-none font-black uppercase">
            Closest {currentValue ?? "--"}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Reset board"
          className="border-destructive/25 bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive focus-visible:ring-destructive/30 dark:bg-destructive/15 dark:hover:bg-destructive/25 absolute top-0 right-0 z-20 h-7 gap-1 rounded-md px-2 text-[0.65rem] font-black uppercase"
          disabled={readOnly}
          onClick={onReset}
        >
          <RotateCcwIcon className="size-3.5" />
          Reset
        </Button>

        <MathinikTargetPentagon
          target={target}
          className="absolute top-0 left-1/2 z-10 h-13 w-21 -translate-x-1/2"
          valueClassName="text-xl"
        />

        <div
          className={cn(
            "relative h-5 rounded-full border shadow-inner",
            isExact && "shadow-[0_0_18px_rgba(45,212,191,0.7)]"
          )}
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #4338ca 0%, #06b6d4 32%, #2dd4bf 50%, #06b6d4 68%, #4338ca 100%)",
            }}
          >
            <div className="absolute inset-0 animate-pulse bg-white/15" />
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 opacity-75"
              style={{
                animation:
                  "mathinik-gauge-shimmer-left 15s ease-in-out infinite",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.75) 52%, transparent 100%)",
                transform: "translateX(-105%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-75"
              style={{
                animation:
                  "mathinik-gauge-shimmer-right 15s ease-in-out infinite",
                background:
                  "linear-gradient(270deg, transparent 0%, rgba(255,255,255,0.75) 52%, transparent 100%)",
                transform: "translateX(105%)",
              }}
            />
          </div>
          <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 animate-pulse rounded-full bg-white/90 shadow-sm" />
          <div
            className={cn(
              "absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black shadow-md transition-[left,background-color] duration-500 ease-out will-change-[left] dark:bg-white",
              isExact && "bg-yellow-300 dark:bg-yellow-300"
            )}
            style={{ left: `${markerPosition}%` }}
          />
          <div
            className={cn(
              "absolute top-1/2 flex items-center gap-0.5 text-xs leading-none font-black text-white opacity-70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] transition-[left,transform,color] duration-500 ease-out",
              delta === null && "opacity-0"
            )}
            style={{
              left: `${markerPosition}%`,
              transform:
                delta !== null && delta > 0
                  ? "translate(calc(-100% - 0.55rem), -50%)"
                  : "translate(0.55rem, -50%)",
            }}
          >
            {delta !== null && delta > 0 && (
              <>
                <span className="tabular-nums">{deltaMagnitude ?? 0}</span>
                <ChevronLeftIcon className="size-3 stroke-[3]" />
              </>
            )}
            {delta !== null && delta < 0 && (
              <>
                <ChevronRightIcon className="size-3 stroke-[3]" />
                <span className="tabular-nums">{deltaMagnitude ?? 0}</span>
              </>
            )}
          </div>
          {isExact && (
            <>
              <div className="border-saltong-teal-100/90 absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-2 shadow-[0_0_20px_rgba(45,212,191,0.9)]" />
              <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.75),transparent_36%)]" />
            </>
          )}
        </div>
        <div className="text-muted-foreground relative mt-1 h-4 text-[0.6rem] leading-none font-bold uppercase">
          <span className="absolute left-0 tabular-nums">{scaleMin}</span>
          <span
            className="text-foreground absolute -translate-x-1/2 text-sm leading-none font-black tabular-nums transition-[left] duration-500 ease-out"
            style={{ left: `${markerPosition}%` }}
          >
            {currentValue ?? "--"}
          </span>
          <span className="absolute right-0 tabular-nums">{scaleMax}</span>
        </div>
      </div>
      <style jsx>{`
        @keyframes mathinik-gauge-shimmer-left {
          0%,
          3.5% {
            transform: translateX(-105%);
            opacity: 0;
          }
          7% {
            opacity: 0.75;
          }
          11%,
          100% {
            transform: translateX(50%);
            opacity: 0;
          }
        }

        @keyframes mathinik-gauge-shimmer-right {
          0%,
          3.5% {
            transform: translateX(105%);
            opacity: 0;
          }
          7% {
            opacity: 0.75;
          }
          11%,
          100% {
            transform: translateX(-50%);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
