import useShare from "@/hooks/use-share";
import { Share2Icon, ChevronDownIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { ButtonGroup } from "../ui/button-group";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "../ui/menubar";
import { Button } from "../ui/button";
import { sendEvent } from "@/lib/analytics";

export default function ShareButtons(data: {
  title?: string;
  message: string;
}) {
  const { copy, share, canShare } = useShare(data);

  if (!canShare) {
    return (
      <Button
        className="h-12 min-h-12 w-full flex-1 border-r bg-teal-500 hover:bg-teal-600"
        onClick={() => {
          sendEvent("share_results", {
            action: "copy",
          });
          copy();
        }}
      >
        <CopyIcon />
        <span>Copy Results</span>
      </Button>
    );
  }

  return (
    <ButtonGroup className="flex h-12 w-full">
      <Button
        className="h-12 flex-1 border-r bg-teal-500 hover:bg-teal-600"
        onClick={() => {
          sendEvent("share_results", {
            action: "share",
          });

          share().catch((err) => {
            if ((err as Error)?.name === "AbortError") {
              return;
            }

            toast.error("Cannot share results");
          });
        }}
      >
        <Share2Icon />
        <span>Share Results</span>
      </Button>
      <Menubar className="h-auto !gap-0 !rounded-none !border-none !bg-none !p-0 !shadow-none">
        <MenubarMenu>
          <MenubarTrigger asChild>
            <Button className="h-12 min-w-12 flex-1 rounded-l-none bg-teal-500 hover:bg-teal-600">
              <ChevronDownIcon />
            </Button>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={copy}>Copy Results</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ButtonGroup>
  );
}
