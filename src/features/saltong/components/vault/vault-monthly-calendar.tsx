"use client";

import HoverPrefetchLink from "@/components/shared/hover-prefetch-link";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DATE_FORMAT, getDateInPh } from "@/utils/time";
import {
  differenceInCalendarDays,
  endOfMonth,
  format,
  startOfMonth,
} from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { SaltongMode } from "../../types";
import { useSaltongVaultRounds } from "../../hooks/vault-rounds";

const getGameCount = (gameStartDate: string, date: Date) => {
  const gameModeStartDate = new Date(gameStartDate);

  return (
    differenceInCalendarDays(
      getDateInPh(date),
      getDateInPh(gameModeStartDate)
    ) + 1
  );
};

export default function VaultMonthlyCalendar({
  mode,
  path,
  gameModeStartDate,
  focusedDate,
  userId,
}: {
  mode: SaltongMode;
  path: string;
  gameModeStartDate: string;
  focusedDate: Date;
  userId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const dateRange = useMemo(
    () => ({
      startDate: format(startOfMonth(focusedDate), DATE_FORMAT),
      endDate: format(endOfMonth(focusedDate), DATE_FORMAT),
    }),
    [focusedDate]
  );

  const { data: answers } = useSaltongVaultRounds({
    userId: userId || "unauthenticated",
    mode,
    ...dateRange,
  });

  const solvedDates = useMemo(() => {
    return Object.entries(answers ?? {})
      .filter(([, { isCorrect }]) => isCorrect)
      .map(([, { date }]) => new Date(`${date}T00:00:00+08:00`));
  }, [answers]);

  const failedDates = useMemo(() => {
    return Object.entries(answers ?? {})
      .filter(([, { isCorrect, endedAt }]) => !isCorrect && endedAt)
      .map(([, { date }]) => new Date(`${date}T00:00:00+08:00`));
  }, [answers]);

  const unfinishedDates = useMemo(() => {
    return Object.entries(answers ?? {})
      .filter(([, { isCorrect, endedAt }]) => !isCorrect && !endedAt)
      .map(([, { date }]) => new Date(`${date}T00:00:00+08:00`));
  }, [answers]);

  return (
    <div>
      <Calendar
        mode="single"
        captionLayout="dropdown"
        startMonth={new Date(gameModeStartDate)}
        endMonth={new Date()}
        disabled={{
          before: new Date(gameModeStartDate),
          after: new Date(),
        }}
        onSelect={(date) => {
          if (!date) {
            return;
          }

          router.push(`/play${path}?d=${format(date, DATE_FORMAT)}`);
        }}
        month={focusedDate}
        onMonthChange={(date) => {
          router.replace(`${pathname}?d=${date.valueOf() / 100000}`);
        }}
        modifiersClassNames={{
          solved:
            "bg-green-400 dark:bg-green-600 text-green-900  dark:text-green-100 hover:bg-green-500 dark:hover:bg-green-700",
          failed:
            "bg-rose-400 dark:bg-rose-600 text-rose-900 dark:text-rose-100 hover:bg-rose-500 dark:hover:bg-rose-700",
          unfinished:
            "bg-yellow-400 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100  hover:bg-yellow-500 dark:hover:bg-yellow-700",
        }}
        modifiers={{
          solved: solvedDates,
          failed: failedDates,
          unfinished: unfinishedDates,
        }}
        classNames={{
          day_today: "border border-2 border-primary/80 dark:border-white",
          months: "flex-col space-y-4",
          cell: "w-full text-center rounded-full text-md px-0 py-1 relative focus-within:relative focus-within:z-20 rounded-full",
          head_cell:
            "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "size-[45px] sm:size-14 p-0 font-semibold text-md aria-selected:opacity-100 rounded-full"
          ),
        }}
        className="w-full"
        showOutsideDays={false}
        components={{
          DayButton: ({ day }) => {
            const gameCount = getGameCount(gameModeStartDate, day.date);
            return (
              <HoverPrefetchLink
                className="h-full w-full"
                href={`/play${path}?d=${format(day.date, DATE_FORMAT)}`}
              >
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <span>{day.date.getDate()}</span>
                  <span className="-mt-1 text-xs font-medium opacity-50">
                    {gameCount > 0 ? gameCount : "."}
                  </span>
                </div>
              </HoverPrefetchLink>
            );
          },
        }}
      />

      <div className="bg-primary-foreground text-primary/80 mx-auto mt-8! flex max-w-[400px] justify-center gap-8 rounded-lg py-2 text-sm font-bold">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-400 dark:bg-green-600" />
          <span>SOLVED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-400 dark:bg-rose-600" />
          <span>FAILED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-yellow-400 dark:bg-yellow-600" />
          <span>UNFINISHED</span>
        </div>
      </div>
    </div>
  );
}
