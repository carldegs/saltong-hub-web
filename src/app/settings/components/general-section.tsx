"use client";

import {
  SettingsSectionHeader,
  SettingsSectionItem,
  SettingsSectionList,
  SettingsSectionContent,
} from "./settings-section";
import { ColorModeToggle } from "@/components/shared/color-mode-toggle";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { PowerIcon, PowerOffIcon } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { useIsMounted } from "@/hooks/use-is-mounted";
import useHighContrast from "@/hooks/use-high-contrast";

export default function GeneralSection() {
  const { highContrast, setHighContrast } = useHighContrast();
  const [language, setLanguage] = useLocalStorage("language", "EN");
  const mounted = useIsMounted();

  return (
    <section>
      <SettingsSectionHeader>General</SettingsSectionHeader>
      <SettingsSectionContent>
        <SettingsSectionList>
          <SettingsSectionItem>
            <span>Color Mode</span>
            <ColorModeToggle location="settings" />
          </SettingsSectionItem>
          <SettingsSectionItem
            className="gap-5"
            onClick={() => setHighContrast(!highContrast)}
          >
            <div className="flex flex-col">
              <span>High Contrast Mode</span>
              <span className="text-muted-foreground mt-1 text-xs">
                Improves visibility by increasing color contrast for better
                accessibility.
              </span>
            </div>
            {mounted && (
              <Button size="sm" variant={highContrast ? "default" : "outline"}>
                <PowerIcon
                  className={cn({
                    hidden: !highContrast,
                    block: highContrast,
                  })}
                />
                <PowerOffIcon
                  className={cn({
                    hidden: highContrast,
                    block: !highContrast,
                  })}
                />
              </Button>
            )}
          </SettingsSectionItem>
          <SettingsSectionItem>
            {/* TODO: Implement Language */}
            <span>Language</span>
            {mounted && (
              <ToggleGroup
                type="single"
                value={language}
                onValueChange={setLanguage}
                variant="outline"
              >
                <ToggleGroupItem value="EN" className="cursor-pointer">
                  🇺🇸
                </ToggleGroupItem>
                <ToggleGroupItem value="PH" className="cursor-pointer">
                  🇵🇭
                </ToggleGroupItem>
              </ToggleGroup>
            )}
          </SettingsSectionItem>
        </SettingsSectionList>
      </SettingsSectionContent>
    </section>
  );
}
