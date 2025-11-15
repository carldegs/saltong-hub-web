"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Heading = {
  level: number;
  text: string;
  id: string;
};

type TableOfContentsProps = {
  headings: Heading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -66%",
        threshold: 0,
      }
    );

    // Observe all headings
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <>
      {/* Sticky Sidebar - Desktop */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24">
          <h2 className="mb-4 text-sm font-semibold tracking-wider uppercase">
            On This Page
          </h2>
          <nav className="space-y-2">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`block text-sm transition-colors ${
                  heading.level === 3 ? "pl-4" : ""
                } ${
                  activeId === heading.id
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Outline Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="fixed right-6 bottom-6 gap-2 shadow-lg lg:hidden"
          >
            <List size={20} />
            <span className="font-semibold">Outline</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[90vw] sm:w-[400px]">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl font-bold">On This Page</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                    // Close the sheet after clicking
                    const closeButton = document.querySelector(
                      '[aria-label="Close"]'
                    ) as HTMLButtonElement;
                    closeButton?.click();
                  }
                }}
                className={`group flex items-start gap-3 rounded-lg px-4 py-3 transition-all ${
                  heading.level === 3 ? "pl-8" : ""
                } ${
                  activeId === heading.id
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {/* Active indicator dot */}
                {activeId === heading.id ? (
                  <div className="bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full" />
                ) : (
                  <div className="border-muted-foreground/30 group-hover:border-foreground/50 mt-1.5 h-2 w-2 shrink-0 rounded-full border-2" />
                )}

                {/* Text */}
                <span
                  className={`flex-1 leading-relaxed ${
                    heading.level === 3 ? "text-sm" : "text-base"
                  }`}
                >
                  {heading.text}
                </span>
              </a>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="border-muted mt-6 border-t pt-4">
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>
                {headings.findIndex((h) => h.id === activeId) + 1} of{" "}
                {headings.length}
              </span>
              <span className="font-medium">
                {Math.round(
                  ((headings.findIndex((h) => h.id === activeId) + 1) /
                    headings.length) *
                    100
                )}
                % complete
              </span>
            </div>
            <div className="bg-muted mt-2 h-1.5 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{
                  width: `${
                    ((headings.findIndex((h) => h.id === activeId) + 1) /
                      headings.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
