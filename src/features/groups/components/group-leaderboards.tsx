"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { add, format } from "date-fns";
import { ChevronDownIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

function DatePicker({
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

export default function GroupLeaderboards() {
  const [date, setDate] = useState(new Date());

  const [api, setApi] = useState<CarouselApi>();
  const [, setCurrent] = useState(0);
  const [, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(api.snapList().length);
    setCurrent(api.selectedSnap() + 1);
    // api.on("select", () => {
    //   setCurrent(api.selectedScrollSnap() + 1);
    // });
  }, [api]);

  return (
    <div className="grid h-full w-full grid-rows-[auto_1fr] gap-2">
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="size-10"
          onClick={() => {
            setDate(add(date, { days: -1 }));
          }}
        >
          <ChevronLeft size={16} />
        </Button>
        <DatePicker date={date} setDate={setDate} />
        <Button
          variant="outline"
          size="icon"
          className="size-10"
          onClick={() => {
            setDate(add(date, { days: 1 }));
          }}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
      <div className="h-full">
        <Carousel setApi={setApi} className="my-4 w-full">
          <CarouselContent>
            {/* <CarouselItem className="lg:basis-1/ hidden md:flex md:basis-1/2"></CarouselItem> */}

            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <Card className="h-full">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}

            {/* <CarouselItem className="lg:basis-1/ hidden md:flex md:basis-1/2"></CarouselItem> */}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="absolute bottom-4 flex gap-2 rounded-lg bg-gray-200 px-4 py-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Button
            key={index}
            variant="default"
            onClick={() => {
              api?.goTo(index);
            }}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}
