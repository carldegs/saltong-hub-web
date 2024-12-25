import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ColorModeToggle } from "@/components/shared/color-mode-toggle";
import Link from "next/link";

export function SettingsSidebarMenu() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-between pl-2 pr-1">
        Color Mode <ColorModeToggle />
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton className="h-auto">
          <Link
            href="/privacy"
            className="flex w-full items-center gap-3 text-base"
          >
            <span className="text-base">Privacy Policy</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton className="h-auto">
          <Link
            href="/about"
            className="flex w-full items-center gap-3 text-base"
          >
            <span className="text-base">About</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
