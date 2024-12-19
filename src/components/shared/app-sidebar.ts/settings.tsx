import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { ColorModeToggle } from "@/components/shared/color-mode-toggle";

export function SettingsSidebarMenu() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="text-md flex items-center justify-between pl-3 pr-1">
        <span>Color Mode</span>
        <ColorModeToggle />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
