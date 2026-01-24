"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { sendEvent } from "@/lib/analytics";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LoginSidebarMenu({
  className,
}: {
  className?: string;
}) {
  const { setOpenMobile } = useSidebar();
  const currPathname = usePathname();

  return (
    <Button
      className={className}
      size="lg"
      onClick={() => {
        setOpenMobile(false);
      }}
      asChild
    >
      <Link
        href={{
          pathname: "/auth",
          query: { returnTo: currPathname },
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
  );
}
