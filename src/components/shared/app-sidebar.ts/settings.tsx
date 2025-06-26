import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function SettingsSidebarMenu() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="h-auto py-1.5" asChild>
          <Link href="/settings" className="flex w-full items-center gap-3">
            <span className="text-sm">Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton className="h-auto py-1.5" asChild>
          <Link href="/about" className="flex w-full items-center gap-3">
            <span className="text-sm">About</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {data?.user && (
        <SidebarMenuItem>
          <SidebarMenuButton className="h-auto py-1.5" asChild>
            <Link
              href="/settings/account"
              className="flex w-full items-center gap-3"
            >
              <span className="text-sm">Account</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
