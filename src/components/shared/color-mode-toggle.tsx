"use client";

import * as React from "react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { sendEvent } from "@/lib/analytics";
import { useIsMounted } from "usehooks-ts";

export function ColorModeToggle({ location }: { location?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted()) {
    return null;
  }

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={theme}
      onValueChange={(theme) => {
        sendEvent("color_mode_change", {
          theme,
          location,
        });
        setTheme(theme);
      }}
    >
      <ToggleGroupItem value="light">
        <Sun className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark">
        <Moon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="system">
        <SunMoon className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
