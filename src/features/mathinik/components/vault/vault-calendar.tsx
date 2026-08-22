"use client";

import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DATE_FORMAT } from "@/utils/time";
import { format } from "date-fns";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { DayButtonProps } from "react-day-picker";
import { MATHINIK_CONFIG } from "../../config";
import { getMathinikRoundIdFromDate } from "../../utils";

export default function MathinikVaultCalendar({
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
      startMonth={new Date(MATHINIK_CONFIG.startDate)}
      endMonth={new Date()}
      disabled={{
        before: new Date(MATHINIK_CONFIG.startDate),
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
          const gameCount = getMathinikRoundIdFromDate(dateKey);
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
                      {gameCount}
                    </span>
                  </div>
                </button>
              </PopoverAnchor>
              <PopoverContent className="w-48 p-2" align="center">
                <div className="mb-2 px-2 text-sm font-semibold">
                  {format(day.date, "MMM d, yyyy")}
                </div>
                <Link
                  href={`/play/mathinik?d=${dateKey}`}
                  prefetch={false}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-start"
                  )}
                  onClick={() => {
                    setOpenDate(null);
                  }}
                >
                  Play Mathinik
                </Link>
              </PopoverContent>
            </Popover>
          );
        },
      }}
    />
  );
}
