"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function HighlightCardWrapper({
  theme = "green",
  children,
  className,
}: {
  theme?: "green" | "red" | "blue" | "purple";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-muted mx-auto flex w-fit flex-col items-center justify-center rounded-4xl border-4 bg-linear-to-br p-4",
        {
          "from-saltong-green-600 to-saltong-green-700 border-saltong-green-700 dark:from-saltong-green-950 dark:to-saltong-green-900 dark:border-saltong-green-950":
            theme === "green",
          "from-saltong-red-600 to-saltong-red-700 border-saltong-red-700 dark:from-saltong-red-950 dark:to-saltong-red-900 dark:border-saltong-red-950":
            theme === "red",
          "from-saltong-blue-600 to-saltong-blue-700 border-saltong-blue-700 dark:from-saltong-blue-950 dark:to-saltong-blue-900 dark:border-saltong-blue-950":
            theme === "blue",
          "from-saltong-purple-600 to-saltong-purple-700 border-saltong-purple-700 dark:from-saltong-purple-950 dark:to-saltong-purple-900 dark:border-saltong-purple-950":
            theme === "purple",
        },
        className
      )}
    >
      {children}
    </div>
  );
}
