"use client";

import { useState } from "react";
import Image from "next/image";
import { DM_Serif_Display } from "next/font/google";
import { Button } from "@/components/ui/button";
import TrackedLink from "../shared/tracked-link";

const displayFont = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
});

const displayFontItalic = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export default function GlobalLeaderboardsBanner() {
  const [showOriginalHeadline] = useState(() => new Date().getSeconds() < 48);

  return (
    <div className="@container w-full pt-8 @xl:pt-10">
      <div className="border-saltong-purple-400/70 from-saltong-purple-950 via-saltong-purple-800 to-saltong-purple-600 relative isolate rounded-[22px] border bg-linear-to-br shadow-[0_16px_50px_rgba(77,39,160,0.22)]">
        <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-[radial-gradient(circle_at_top_left,_rgba(196,181,253,0.3),_transparent_28%)]" />
        <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-[radial-gradient(circle_at_85%_50%,_rgba(167,139,250,0.4),_transparent_35%)]" />
        <div className="relative flex min-h-[300px] flex-col items-center justify-center px-5 py-8 text-center @md:min-h-[300px] @md:px-8 @xl:min-h-[300px] @xl:px-10">
          <Image
            src="/3d-hub-logo.png"
            alt=""
            aria-hidden="true"
            width={220}
            height={220}
            className="pointer-events-none absolute top-[-70px] left-0 z-10 w-[170px] animate-[float_5.8s_ease-in-out_infinite] drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)] select-none @md:top-[-36px] @md:left-[-4] @xl:top-[-74px] @2xl:left-0 @2xl:w-[220px]"
          />
          <Image
            src="/crown.png"
            alt=""
            aria-hidden="true"
            width={330}
            height={330}
            className="pointer-events-none absolute right-[-10px] bottom-[-44px] z-10 w-[150px] -scale-x-100 animate-[float_7.6s_ease-in-out_infinite] drop-shadow-[0_22px_26px_rgba(69,35,3,0.35)] select-none @md:right-0 @md:bottom-[-28px] @md:w-[172px] @xl:right-6 @xl:bottom-[-62px] @xl:w-[228px]"
          />

          <div className="relative z-20 mx-auto flex w-full max-w-3xl flex-col items-center pt-6 @xl:max-w-4xl @xl:px-16 @xl:pt-0">
            <p
              className={`${displayFont.className} max-w-[12.5ch] text-[3rem] leading-[0.9] font-normal tracking-[-0.05em] text-[#f2e8ff] @md:max-w-[13.5ch] @md:text-[3.45rem] @xl:max-w-[2xl] @xl:text-[4.25rem] @2xl:text-[4.75rem] @4xl:max-w-none`}
            >
              {showOriginalHeadline ? (
                <>
                  it&apos;s{" "}
                  <span className={displayFontItalic.className}>you</span>{" "}
                  against the{" "}
                  <span className={displayFontItalic.className}>world.</span>
                </>
              ) : (
                <>
                  Hawak mo ang...{" "}
                  <span className={displayFontItalic.className}>crown?</span>
                </>
              )}
            </p>

            <p className="mt-4 max-w-[26ch] text-base leading-[1.2] font-medium tracking-[-0.03em] text-[#f3ecff] @md:max-w-[22ch] @md:text-lg @xl:max-w-3xl @xl:text-[1.35rem] @xl:leading-tight">
              Join the <span className="font-bold">Global Leaderboards</span>{" "}
              and see how you rank against other players
            </p>

            <Button
              asChild
              size="lg"
              className="text-saltong-purple-300 mt-8 h-11 min-w-[190px] rounded-lg bg-[#3f236e] px-8 text-lg font-bold tracking-[-0.02em] shadow-none hover:bg-[#4b2a84] hover:text-[#dbc9ff] @xl:mt-9"
            >
              <TrackedLink
                href="/groups/b44c6cef-2d06-4922-84cb-5d0816af3794"
                prefetch={false}
                event="button_click"
                eventParams={{
                  location: "leaderboards_banner",
                  action: "join_global_leaderboards",
                }}
              >
                Join Now
              </TrackedLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
