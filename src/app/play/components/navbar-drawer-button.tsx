"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import dynamic from "next/dynamic";
import { ReactNode, useState } from "react";

const NavbarDrawer = dynamic(() => import("./navbar-drawer"), { ssr: false });

export default function NavbarDrawerButton({
  children,
}: {
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NavbarDrawer open={open} onOpenChange={setOpen}>
        {children}
      </NavbarDrawer>
      <Button
        size="icon"
        variant="outline"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Menu className="size-5" />
      </Button>
    </>
  );
}
