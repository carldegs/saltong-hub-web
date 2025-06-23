"use client";

import {
  SettingsSectionHeader,
  SettingsSectionItem,
  SettingsSectionItemLink,
  SettingsSectionList,
  SettingsSectionContent,
} from "./settings-section";

export default function SupportSection() {
  const handleResetGameData = () => {
    // TODO: Implement reset game data logic
    alert("Reset game data handler");
  };
  return (
    <section>
      <SettingsSectionHeader>Support</SettingsSectionHeader>
      <SettingsSectionContent>
        <SettingsSectionList>
          {/* TODO: Setup Bug Reporting Tool */}
          <SettingsSectionItemLink href="/report">
            Report Bug
          </SettingsSectionItemLink>
          <a href="mailto:carl@carldegs.com">
            <SettingsSectionItem>Send Email</SettingsSectionItem>
          </a>
          {/* TODO: Setup Reset Game Data */}
          <SettingsSectionItem onClick={handleResetGameData}>
            Reset Game Data
          </SettingsSectionItem>
        </SettingsSectionList>
      </SettingsSectionContent>
    </section>
  );
}
