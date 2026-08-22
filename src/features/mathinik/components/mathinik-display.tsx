import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

function getNumberSizeClass(value: number) {
  const length = String(Math.abs(value)).length;

  if (length >= 7) return "text-[0.6rem] sm:text-xs";
  if (length >= 5) return "text-[0.7rem] sm:text-sm";
  if (length >= 4) return "text-xs sm:text-base";
  return "";
}

export function NumberValue({
  value,
  label,
}: {
  value: number;
  label?: ReactNode;
}) {
  return (
    <span className="relative flex size-full min-w-0 items-center justify-center">
      <span
        className={cn(
          "block max-w-full overflow-hidden px-0.5 leading-none text-ellipsis tabular-nums",
          getNumberSizeClass(value)
        )}
      >
        {value}
      </span>
      {label && (
        <span className="absolute top-0.5 right-1 text-xs leading-none font-black opacity-45 sm:top-1 sm:right-1.5 sm:text-sm">
          {label}
        </span>
      )}
    </span>
  );
}

export function MathinikTargetPentagon({
  target,
  className,
  valueClassName,
}: {
  target: number;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <svg
        className="absolute inset-0 h-full w-full drop-shadow-sm"
        viewBox="0 0 84 52"
        aria-hidden
      >
        <path
          d="M12 1H72Q79 1 79 8V35Q79 40 74 42L45 51Q42 52 39 51L10 42Q5 40 5 35V8Q5 1 12 1Z"
          fill="#0f766e"
          strokeWidth="2"
        />
      </svg>
      <div className="relative flex h-full flex-col items-center justify-center px-2 py-2 text-center text-white">
        <div className="text-[0.62rem] leading-none font-black uppercase opacity-85">
          Target
        </div>
        <div
          className={cn(
            "mt-0 text-2xl leading-none font-black tabular-nums",
            valueClassName
          )}
        >
          {target}
        </div>
      </div>
    </div>
  );
}

export function MathinikStaticBox({
  children,
  muted,
}: {
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-background/80 flex size-10 items-center justify-center rounded-lg border-2 text-base font-black shadow-sm sm:size-12 sm:text-lg",
        muted
          ? "bg-muted border-saltong-teal-700/25"
          : "border-saltong-teal-700/25"
      )}
    >
      {children}
    </div>
  );
}
