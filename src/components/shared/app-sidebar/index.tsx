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
import { SettingsSidebarMenu } from "./settings";
import { MoreSidebarMenu } from "./more";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { NavbarBrand } from "../navbar";
import NavUser from "./nav-user";
import { GroupsSidebarMenu } from "./groups";

export async function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center gap-2 py-2">
          <NavbarBrand
            title="Saltong"
            subtitle="Hub"
            icon="/hub-light.svg"
            iconLight="/hub.svg"
            hideMenu
            href="/"
            prefetch={false}
            forceLarge
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupLabel>GAMES</SidebarGroupLabel>{" "}
          <SidebarGroupAction
            className="mr-4 text-sm whitespace-nowrap hover:underline"
            asChild
          >
            <Link href="/" prefetch={false}>
              <span>See All</span>
              <ChevronRightIcon />
            </Link>
          </SidebarGroupAction>
          <GamesSidebarMenu />
        </SidebarGroup>
        {/* <SidebarGroup>
          <SidebarGroupLabel>OTHER GAMES</SidebarGroupLabel>
          <OtherGamesSidebarMenu />
        </SidebarGroup> */}
        <GroupsSidebarMenu />
        <SidebarGroup>
          <SidebarGroupLabel>MORE</SidebarGroupLabel>
          <SettingsSidebarMenu />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <MoreSidebarMenu />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
