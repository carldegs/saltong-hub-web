// import sendEvent from "@/lib/analytics";
import { ReactNode } from "react";

import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../ui/hover-card";

export default function SocialButton({
  icon,
  url,
  title,
  description,
}: {
  icon: ReactNode;
  url: string;
  title: string;
  description?: string;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            // sendEvent("contact", {
            //   type: title,
            // });
          }}
        >
          <Button variant="secondary" size="icon">
            {icon}
          </Button>
        </a>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col gap-0">
          <h4 className="text-base font-bold">{title}</h4>
          <p className="text-sm">{description}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
