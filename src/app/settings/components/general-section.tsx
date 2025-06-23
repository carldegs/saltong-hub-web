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

export default function GeneralSection() {
  const [colorblind, setColorblind] = useLocalStorage("colorblind", false);
  const [language, setLanguage] = useLocalStorage("language", "EN");
  const mounted = useIsMounted();

  return (
    <section>
      <SettingsSectionHeader>General</SettingsSectionHeader>
      <SettingsSectionContent>
        <SettingsSectionList>
          <SettingsSectionItem>
            <span>Color Mode</span>
            <ColorModeToggle />
          </SettingsSectionItem>
          <SettingsSectionItem onClick={() => setColorblind(!colorblind)}>
            {/* TODO: Implement Colorblind Mode */}
            <span>Colorblind Mode</span>
            {mounted && (
              <Button size="sm" variant={colorblind ? "default" : "outline"}>
                <PowerIcon
                  className={cn({
                    hidden: !colorblind,
                    block: colorblind,
                  })}
                />
                <PowerOffIcon
                  className={cn({
                    hidden: colorblind,
                    block: !colorblind,
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
