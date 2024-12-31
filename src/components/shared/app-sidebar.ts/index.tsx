import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { GamesSidebarMenu } from "./games";
import { OtherGamesSidebarMenu } from "./other-games";
import { NavUser } from "./nav-user";
import { SettingsSidebarMenu } from "./settings";
import { MoreSidebarMenu } from "./more";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { NavbarBrand } from "../navbar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center justify-center gap-2 py-2">
          <NavbarBrand
            title="Saltong"
            subtitle="Hub"
            icon="/hub-light.svg"
            iconLight="/hub.svg"
            hideMenu
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>GAMES</SidebarGroupLabel>{" "}
          <SidebarGroupAction
            className="mr-4 whitespace-nowrap text-sm hover:underline"
            asChild
          >
            <Link href="/">
              <span>See All</span>
              <ChevronRightIcon />
            </Link>
          </SidebarGroupAction>
          <GamesSidebarMenu />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>OTHER GAMES</SidebarGroupLabel>
          <OtherGamesSidebarMenu />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>SETTINGS</SidebarGroupLabel>
          <SettingsSidebarMenu />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <MoreSidebarMenu />

        <NavUser
          user={{
            name: "carldegs",
            email: "carl.2795@gmail.com",
            avatar: "https://avatars.githubusercontent.com/u/1792317?v=4",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
