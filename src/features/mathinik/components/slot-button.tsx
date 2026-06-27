import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SlotButton({
  active,
  children,
  onClick,
  invalid,
  ariaLabel,
  disabled,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  invalid?: boolean;
  ariaLabel: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "bg-background/80 relative flex size-10 items-center justify-center rounded-lg border-2 text-base font-black shadow-sm transition-colors disabled:cursor-default disabled:opacity-75 sm:size-14 sm:text-lg",
        active
          ? "border-saltong-teal-600 ring-saltong-teal-500/35 ring-3"
          : "border-saltong-teal-700/25 hover:border-saltong-teal-500/60",
        invalid && "border-destructive text-destructive"
      )}
    >
      {children}
      {active && (
        <span className="bg-saltong-teal absolute -bottom-1 left-1/2 h-1 w-7 -translate-x-1/2 rounded-full" />
      )}
    </button>
  );
}
