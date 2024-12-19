import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar";
import { GamesSidebarMenu } from "./games";
import { OtherGamesSidebarMenu } from "./other-games";
import { NavUser } from "./nav-user";
import { SettingsSidebarMenu } from "./settings";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>GAMES</SidebarGroupLabel>
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
