"use client";
import {
  SettingsSectionHeader,
  SettingsSectionItem,
  SettingsSectionItemLink,
  SettingsSectionList,
  SettingsSectionContent,
} from "./settings-section";
import ContributeDialog from "@/components/shared/contribute-dialog";

export default function AboutSection() {
  return (
    <section>
      <SettingsSectionHeader>About</SettingsSectionHeader>
      <SettingsSectionContent>
        <SettingsSectionList>
          {/* TODO: Implement Privacy Policy */}
          <SettingsSectionItemLink href="/privacy">
            Privacy Policy
          </SettingsSectionItemLink>
          {/* TODO: Implement About Page */}
          <SettingsSectionItemLink href="/about">
            About Saltong
          </SettingsSectionItemLink>
          <ContributeDialog>
            <SettingsSectionItem className="cursor-pointer">
              Contribute / Donate
            </SettingsSectionItem>
          </ContributeDialog>
        </SettingsSectionList>
      </SettingsSectionContent>
    </section>
  );
}
