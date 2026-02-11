"use client";
import ContributeDialog from "@/components/shared/contribute-dialog";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ArrowRightIcon, HandCoinsIcon } from "lucide-react";
import { useState } from "react";

export default function ContributeItem() {
  const [showContribution, setShowContribution] = useState(false);

  return (
    <>
      {showContribution && (
        <ContributeDialog
          open={showContribution}
          onOpenChange={setShowContribution}
        />
      )}

      <Item
        variant="outline"
        className="cursor-pointer rounded-lg border-cyan-500 bg-linear-to-br from-cyan-200/20 to-cyan-500/40 text-cyan-900 transition-colors hover:from-cyan-400/40 hover:to-cyan-500/40 dark:text-cyan-100"
        onClick={() => {
          setShowContribution(true);
        }}
      >
        <ItemMedia>
          <HandCoinsIcon size={48} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-primary font-bold">
            Contribute to Saltong Hub
          </ItemTitle>
          <ItemDescription className="text-cyan-800 dark:text-cyan-200">
            <i>Pa-kape ka naman!</i> Help keep the app free and ad-free.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="icon" className="bg-cyan-100 hover:bg-cyan-300">
            <ArrowRightIcon strokeWidth={3} />
          </Button>
        </ItemActions>
      </Item>
    </>
  );
}
