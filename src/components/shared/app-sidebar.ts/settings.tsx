import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ColorModeToggle } from "@/components/shared/color-mode-toggle";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function SettingsSidebarMenu() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-between pr-1 pl-2">
        Color Mode <ColorModeToggle />
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton className="h-auto" asChild>
          <Link
            href="/privacy"
            className="flex w-full items-center gap-3 text-base"
          >
            <span className="text-base">Privacy Policy</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton className="h-auto" asChild>
          <Link
            href="/about"
            className="flex w-full items-center gap-3 text-base"
          >
            <span className="text-base">About</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {data.user && (
        <SidebarMenuItem>
          <SidebarMenuButton className="h-auto" asChild>
            <Link
              href="/account"
              className="flex w-full items-center gap-3 text-base"
            >
              <span className="text-base">Account</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
