"use client";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect } from "react";

export function AdUnitContainer({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(className, {
        "border-2 border-red-500 bg-red-100":
          process.env.NODE_ENV === "development",
      })}
    >
      {children}
    </div>
  );
}

export default function AdUnit({
  adSlot,
  adFormat,
}: {
  adSlot: string;
  adFormat?: string;
}) {
  useEffect(() => {
    try {
      console.log("Loading Adsense ad unit", adSlot);
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
      data-ad-slot={adSlot}
      data-ad-format={adFormat ?? "auto"}
      data-full-width-responsive="true"
    ></ins>
  );
}
