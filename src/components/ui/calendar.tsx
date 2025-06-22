"use client";

import * as React from "react";
import { DayPicker, DropdownProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        dropdowns: cn(
          "flex justify-between gap-2 max-w-[200px] md:max-w-[400px]",
          props.captionLayout === "dropdown" && "w-full"
        ),
        nav: "max-w-prose h-0 relative z-10",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-[40px] bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1 mt-1 dark:bg-gray-200"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-[40px] bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1 mt-1 dark:bg-gray-200"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "grid w-full grid-cols-7 grid-rows-1",
        weekday:
          "text-muted-foreground rounded-md font-normal text-[0.8rem] w-[45px] lg:w-14",
        week: "grid mt-2 grid-cols-7 grid-rows-1",
        day: "h-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-transparent"
        ),
        range_end: "day-range-end",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        chevron: "size-4",
        ...classNames,
      }}
      components={{
        Dropdown: ({ value, onChange, options, className }: DropdownProps) => {
          const selected = options?.find((child) => child.value === value);
          const handleChange = (value: string) => {
            const changeEvent = {
              target: { value },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange?.(changeEvent);
          };

          return (
            <Select
              value={value?.toString()}
              onValueChange={(value) => {
                handleChange(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{selected?.label}</SelectValue>
              </SelectTrigger>
              <SelectContent position="popper" className={className}>
                <ScrollArea>
                  {options?.map((option) => (
                    <SelectItem
                      key={`${option.value}-${option.label}`}
                      value={option.value + ""}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
