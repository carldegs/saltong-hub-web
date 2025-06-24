"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import useHighContrast from "@/hooks/use-high-contrast";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useHighContrast();

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
