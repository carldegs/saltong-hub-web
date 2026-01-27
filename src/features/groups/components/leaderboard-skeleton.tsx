import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { MemberRowSkeleton } from "@/components/shared/member-row";

export function LeaderboardItemSkeleton() {
  return (
    <>
      <MemberRowSkeleton />
      <div className="flex items-center justify-end">
        <Skeleton className="aspect-square size-8 rounded-lg" />
      </div>
    </>
  );
}

export function LeaderboardSkeleton({
  list,
  numItems = 5,
}: {
  list?: {
    avatarUrl?: string;
    displayName?: string;
    username?: string;
  }[];
  numItems?: number;
}) {
  if (!list) {
    return Array.from({ length: numItems }).map((_, i) => (
      <LeaderboardItemSkeleton key={i} />
    ));
  }

  return list.map((data) => <LeaderboardItemSkeleton key={data.username} />);
}

export function DatePicker({
  date,
  setDate,
  minDate,
  maxDate,
  isDateDisabled,
}: {
  date: Date | undefined;
  setDate: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="h-auto w-full max-w-52 justify-between text-base font-bold md:text-lg md:font-normal"
        >
          {date ? format(date, "MMM d, yyyy") : "Select Date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            setDate(date!);
            setOpen(false);
          }}
          hidden={[
            ...(minDate ? [{ before: minDate }] : []),
            ...(maxDate ? [{ after: maxDate }] : []),
          ]}
          disabled={isDateDisabled}
          startMonth={minDate}
          endMonth={maxDate}
          classNames={{
            nav: "absolute z-10 w-[calc(100%-24px)] flex items-center justify-between pt-2",
            button_next: "px-3 cursor-pointer",
            button_previous: "px-3 cursor-pointer",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
