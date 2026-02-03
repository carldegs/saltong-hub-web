import React from "react";
import {
  SettingsSectionHeader,
  SettingsSectionContent,
  SettingsSectionList,
  SettingsSectionItem,
} from "./settings-section";
import { VERSION } from "@/version";

export default function BuildInfoSection() {
  return (
    <section>
      <SettingsSectionHeader>Build Info</SettingsSectionHeader>
      <SettingsSectionContent>
        <SettingsSectionList>
          <SettingsSectionItem>
            <span>Version</span>
            <span className="text-muted-foreground text-sm">v{VERSION}</span>
          </SettingsSectionItem>
        </SettingsSectionList>
      </SettingsSectionContent>
    </section>
  );
}
