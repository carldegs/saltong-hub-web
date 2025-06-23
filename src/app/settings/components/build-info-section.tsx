import React from "react";
import getConfig from "next/config";
import {
  SettingsSectionHeader,
  SettingsSectionContent,
  SettingsSectionList,
  SettingsSectionItem,
} from "./settings-section";

const { publicRuntimeConfig } = getConfig();

export default function BuildInfoSection() {
  return (
    <section>
      <SettingsSectionHeader>Build Info</SettingsSectionHeader>
      <SettingsSectionContent>
        <SettingsSectionList>
          <SettingsSectionItem>
            <span>Version</span>
            <span className="text-muted-foreground text-sm">
              {publicRuntimeConfig?.version}
            </span>
          </SettingsSectionItem>
        </SettingsSectionList>
      </SettingsSectionContent>
    </section>
  );
}
