"use client";
import { sendEvent } from "@/lib/analytics";
import Link, { LinkProps } from "next/link";

export default function TrackedLink({
  children,
  event,
  eventParams = {},
  ...linkProps
}: LinkProps & {
  event?: string;
  eventParams?: Record<string, unknown>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      {...linkProps}
      onClick={() => {
        if (event) {
          sendEvent(event, { ...eventParams });
        }
      }}
      prefetch={false}
    >
      {children}
    </Link>
  );
}
