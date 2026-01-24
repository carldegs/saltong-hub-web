"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { sendEvent } from "@/lib/analytics";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LoginSidebarMenu() {
  const { setOpenMobile } = useSidebar();
  const currPathname = usePathname();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Button
          className="w-full"
          size="lg"
          onClick={() => {
            setOpenMobile(false);
          }}
          asChild
        >
          <Link
            href={{
              pathname: "/auth",
              query: { next: currPathname },
            }}
            onClick={() => {
              sendEvent("button_click", {
                location: "sidebar",
                action: "login",
              });
            }}
            prefetch={false}
          >
            Log in
          </Link>
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
