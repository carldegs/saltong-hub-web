"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ContributeDialog from "../contribute-dialog";
import { HandCoins } from "lucide-react";
import { ColorModeToggle } from "../color-mode-toggle";
import { sendEvent } from "@/lib/analytics";

export function MoreSidebarMenu() {
  const [showContribution, setShowContribution] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem className="mb-2 flex items-center justify-between pr-1 pl-2 text-sm">
        Color Mode <ColorModeToggle location="sidebar" />
      </SidebarMenuItem>
      {showContribution && (
        <ContributeDialog
          open={showContribution}
          onOpenChange={(open) => {
            sendEvent("contribute_dialog", {
              open,
              location: "sidebar",
            });
            setShowContribution(open);
          }}
        />
      )}
      <SidebarMenuItem className="flex w-full items-center justify-between text-base">
        <Button
          className="h-auto w-full justify-start bg-cyan-100 text-cyan-700 hover:bg-cyan-300 dark:bg-cyan-900/20 dark:text-cyan-100 dark:hover:bg-cyan-900"
          variant="secondary"
          onClick={() => {
            setShowContribution(true);
          }}
        >
          <HandCoins className="mr-3 size-4" />
          <div className="flex flex-col items-start text-center">
            <span>Enjoyed the app?</span>
            <span className="opacity-60">Contribute if you can!</span>
          </div>
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
