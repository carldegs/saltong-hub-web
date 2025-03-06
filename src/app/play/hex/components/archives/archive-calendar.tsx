"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  format,
  getYear,
  getMonth,
  startOfMonth,
  add,
  subMonths,
  addMonths,
} from "date-fns";
import { getHexDatesWithPagination } from "@/utils/time";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HEX_CONFIG } from "@/app/play/hex/constants";
import { cn } from "@/lib/utils";
import useHexAnswers from "@/app/play/hex/hooks/useHexAnswers";

interface MonthYear {
  year: number;
  month: number;
}

interface HexDate {
  date: string;
  iteration: number | null;
}

const getMonthsBetweenDates = (startDate: Date, endDate: Date): MonthYear[] => {
  const months: MonthYear[] = [];
  let currentDate = startOfMonth(startDate);

  while (currentDate <= endDate) {
    months.push({
      year: getYear(currentDate),
      month: getMonth(currentDate),
    });
    currentDate = add(currentDate, { months: 1 });
  }

  return months;
};

export default function ArchiveCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDate = searchParams.get("d")
    ? new Date(parseInt(searchParams.get("d")!) * 100000)
    : new Date();

  const [selectedRange, setSelectedRange] = useState<MonthYear>(() => ({
    year: getYear(initialDate),
    month: getMonth(initialDate),
  }));

  const [dates, setDates] = useState<HexDate[]>([]);
  const [answers] = useHexAnswers();

  useEffect(() => {
    const fetchDates = () => {
      const newDates = getHexDatesWithPagination(
        selectedRange.year,
        selectedRange.month
      );
      setDates(newDates);
    };

    fetchDates();
  }, [selectedRange]);

  useEffect(() => {
    router.replace(
      `/play/hex/archives?d=${new Date(selectedRange.year, selectedRange.month).valueOf() / 100000}`
    );
  }, [selectedRange, router]);

  const handleMonthChange = (month: number) => {
    setSelectedRange((prev) => ({ ...prev, month }));
  };

  const handleYearChange = (year: number) => {
    setSelectedRange((prev) => ({ ...prev, year }));
  };

  const handlePreviousMonth = () => {
    setSelectedRange((prev) => {
      const newDate = subMonths(new Date(prev.year, prev.month), 1);
      return { year: getYear(newDate), month: getMonth(newDate) };
    });
  };

  const handleNextMonth = () => {
    setSelectedRange((prev) => {
      const newDate = addMonths(new Date(prev.year, prev.month), 1);
      return { year: getYear(newDate), month: getMonth(newDate) };
    });
  };

  const startDate = new Date(HEX_CONFIG.startDate);
  const endDate = new Date();
  const months = getMonthsBetweenDates(startDate, endDate);

  const availableYears = Array.from(new Set(months.map(({ year }) => year)));
  const availableMonths = months
    .filter(({ year }) => year === selectedRange.year)
    .map(({ month }) => month);

  useEffect(() => {
    if (!availableMonths.includes(selectedRange.month)) {
      const latestMonth = months[months.length - 1];
      setSelectedRange({ year: latestMonth.year, month: latestMonth.month });
    }
  }, [availableMonths, selectedRange.month, months]);

  const isPreviousDisabled =
    selectedRange.year === getYear(startDate) &&
    selectedRange.month === getMonth(startDate);
  const isNextDisabled =
    selectedRange.year === getYear(endDate) &&
    selectedRange.month === getMonth(endDate);

  return (
    <div className="mt-8">
      <div className="flex w-full items-center justify-between space-x-2 px-3">
        <Button
          variant="outline"
          onClick={handlePreviousMonth}
          className="size-[40px]"
          disabled={isPreviousDisabled}
        >
          <ChevronLeft size={16} className="min-w-4" />
        </Button>
        <div className="flex w-full max-w-[200px] gap-2 md:max-w-[400px]">
          <Select
            value={selectedRange.month.toString()}
            onValueChange={(value) => handleMonthChange(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((month) => (
                <SelectItem key={month} value={month.toString()}>
                  {format(new Date(selectedRange.year, month), "MMMM")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedRange.year.toString()}
            onValueChange={(value) => handleYearChange(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          onClick={handleNextMonth}
          className="size-[40px]"
          disabled={isNextDisabled}
        >
          <ChevronRight size={16} className="min-w-4" />
        </Button>
      </div>
      <div className="mt-4 mb-8 grid grid-cols-1 gap-2 px-4 md:grid-cols-2 md:gap-4">
        {dates.map(({ date, iteration }) => {
          const isStarted = answers[date]?.updatedAt;

          return (
            <span key={date} className="hover:bg-muted/50 rounded-lg border">
              <Link href={`/play/hex?d=${date}`}>
                <div className="flex items-center gap-2 p-3">
                  <div
                    className={cn(
                      "leading-tightest flex size-9 min-w-9 items-center justify-center rounded-full font-semibold",
                      {
                        "bg-muted text-muted-foreground": !isStarted,
                        "bg-orange-400 text-orange-900 dark:bg-orange-600 dark:text-orange-100":
                          isStarted,
                      }
                    )}
                  >
                    {iteration}
                  </div>
                  <div className="flex w-full flex-col">
                    <span>{format(date, "MMM dd, yyyy")}</span>
                    <span className="text-xs font-semibold tracking-tight uppercase">
                      {isStarted
                        ? `${answers[date].liveScore} POINTS | ${answers[date].guessedWords.length} GUESSED WORDS`
                        : "NOT STARTED"}
                    </span>
                  </div>
                </div>
              </Link>
            </span>
          );
        })}
      </div>
    </div>
  );
}
