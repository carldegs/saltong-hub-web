import { cn } from "@/lib/utils";
import ProfileAvatar from "@/app/components/profile-avatar";
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

export function LeaderboardItemSkeleton({
  avatarUrl,
  displayName,
  username,
}: {
  avatarUrl?: string;
  displayName?: string;
  username?: string;
}) {
  return (
    <>
      <div className={cn("flex gap-2")}>
        {avatarUrl ? (
          <ProfileAvatar path={avatarUrl} fallback="" className="size-11" />
        ) : (
          <Skeleton className="size-11 rounded-full" />
        )}
        <div className="flex flex-col gap-0">
          <div className="font-bold">
            {displayName || <Skeleton className="h-4 w-30 rounded" />}
          </div>
          <div
            className={cn("-mb-3 text-sm opacity-70", {
              "mt-2 mb-0": !username,
            })}
          >
            {username ? (
              `@${username}`
            ) : (
              <Skeleton className="h-3 w-20 rounded" />
            )}
          </div>
        </div>
      </div>
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

  return list.map((data) => (
    <LeaderboardItemSkeleton
      key={data.username}
      avatarUrl={data.avatarUrl}
      displayName={data.displayName}
      username={data.username}
    />
  ));
}

export function DatePicker({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (date: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="h-auto w-full max-w-52 justify-between text-lg font-bold"
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
        />
      </PopoverContent>
    </Popover>
  );
}
