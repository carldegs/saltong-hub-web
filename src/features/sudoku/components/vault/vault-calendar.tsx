"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  PopoverAnchor,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DATE_FORMAT, getDateInPh } from "@/utils/time";
import { differenceInCalendarDays, format } from "date-fns";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { DayButtonProps } from "react-day-picker";
import { SUDOKU_CONFIG } from "../../config";
import { getSudokuVaultGamePath } from "../../paths";

const getGameCount = (gameStartDate: string, date: Date) => {
  const startDate = new Date(gameStartDate);

  return (
    differenceInCalendarDays(getDateInPh(date), getDateInPh(startDate)) + 1
  );
};

export default function SudokuVaultCalendar({
  focusedDate,
}: {
  focusedDate: Date;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [openDate, setOpenDate] = useState<string | null>(null);

  return (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      startMonth={new Date(SUDOKU_CONFIG.startDate)}
      endMonth={new Date()}
      disabled={{
        before: new Date(SUDOKU_CONFIG.startDate),
        after: new Date(),
      }}
      month={focusedDate}
      onMonthChange={(date) => {
        router.replace(`${pathname}?d=${date.valueOf() / 100000}`);
      }}
      classNames={{
        day_today: "border border-2 border-primary/80 dark:border-white",
        months: "flex-col space-y-4",
        cell: "w-full rounded-full px-0 py-1 text-center text-md focus-within:relative focus-within:z-20",
        head_cell:
          "text-muted-foreground w-full rounded-md font-normal text-[0.8rem]",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-[45px] rounded-full p-0 text-md font-semibold aria-selected:opacity-100 sm:size-14"
        ),
      }}
      className="w-full"
      showOutsideDays={false}
      components={{
        DayButton: ({ day, className, ...props }: DayButtonProps) => {
          const dateKey = format(day.date, DATE_FORMAT);
          const gameCount = getGameCount(SUDOKU_CONFIG.startDate, day.date);
          const isOpen = openDate === dateKey;

          return (
            <Popover
              open={isOpen}
              onOpenChange={(open) => {
                setOpenDate(open ? dateKey : null);
              }}
            >
              <PopoverAnchor asChild>
                <button
                  {...props}
                  className={cn(className, "h-full w-full rounded-full")}
                  onClick={(event) => {
                    setOpenDate((current) =>
                      current === dateKey ? null : dateKey
                    );
                    props.onClick?.(event);
                  }}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <span>{day.date.getDate()}</span>
                    <span className="-mt-1 text-xs font-medium opacity-50">
                      {gameCount > 0 ? gameCount : "."}
                    </span>
                  </div>
                </button>
              </PopoverAnchor>
              <PopoverContent className="w-48 p-2" align="center">
                <div className="mb-2 px-2 text-sm font-semibold">
                  {format(day.date, "MMM d, yyyy")}
                </div>
                <div className="flex flex-col gap-1">
                  {Object.values(SUDOKU_CONFIG.modes).map((modeConfig) => (
                    <Link
                      key={modeConfig.mode}
                      href={`/play${getSudokuVaultGamePath({
                        date: dateKey,
                        mode: modeConfig.mode,
                      })}`}
                      prefetch={false}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "justify-start"
                      )}
                      onClick={() => {
                        setOpenDate(null);
                      }}
                    >
                      {modeConfig.displayName}
                    </Link>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          );
        },
      }}
    />
  );
}
