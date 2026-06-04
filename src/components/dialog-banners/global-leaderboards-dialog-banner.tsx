import Image from "next/image";
import { DM_Serif_Display } from "next/font/google";
import { Button } from "@/components/ui/button";
import TrackedLink from "../shared/tracked-link";

const GLOBAL_LEADERBOARDS_INVITE_URL = "/j/UM4HRTQ4";

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

export function GlobalLeaderboardsDialogBanner({
  isAuthenticated,
  mode,
  date,
}: {
  isAuthenticated: boolean;
  mode: string;
  date: string;
}) {
  return (
    <div className="from-saltong-purple-950 via-saltong-purple-800 to-saltong-purple-600 border-saltong-purple-400/70 relative flex h-full min-h-[292px] w-full flex-col items-center justify-center rounded-lg border bg-linear-to-br px-5 py-6 text-center text-[#f3ecff]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(196,181,253,0.28),_transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_50%,_rgba(167,139,250,0.36),_transparent_34%)]" />

      <Image
        src="/3d-hub-logo.png"
        alt=""
        aria-hidden="true"
        width={180}
        height={180}
        className="pointer-events-none absolute top-[-14px] left-[-6px] z-10 w-[108px] animate-[float_5.8s_ease-in-out_infinite] drop-shadow-[0_14px_20px_rgba(0,0,0,0.35)] select-none md:left-2 md:w-[120px]"
      />
      <Image
        src="/crown.png"
        alt=""
        aria-hidden="true"
        width={220}
        height={220}
        className="pointer-events-none absolute right-[-14px] bottom-[-20px] z-10 w-[116px] -scale-x-100 animate-[float_7.6s_ease-in-out_infinite] drop-shadow-[0_18px_22px_rgba(69,35,3,0.35)] select-none md:right-0 md:w-[132px]"
      />

      <div className="relative z-20 flex max-w-sm flex-col items-center">
        <p
          className={`${displayFont.className} max-w-[12ch] text-[2.5rem] leading-[0.92] font-normal tracking-[-0.05em] text-[#f2e8ff] md:text-[3rem]`}
        >
          it&apos;s <span className={displayFontItalic.className}>you</span>{" "}
          against the{" "}
          <span className={displayFontItalic.className}>world.</span>
        </p>

        <p className="mt-3 max-w-[28ch] text-sm leading-[1.25] font-medium tracking-[-0.02em] text-[#f3ecff] md:text-base">
          Join the <span className="font-bold">Global Leaderboards</span> and
          see how you rank against other players
        </p>

        {isAuthenticated ? (
          <Button
            asChild
            size="lg"
            className="text-saltong-purple-300 mt-6 h-10 min-w-[180px] rounded-lg bg-[#3f236e] px-7 text-base font-bold tracking-[-0.02em] shadow-none hover:bg-[#4b2a84] hover:text-[#dbc9ff]"
          >
            <TrackedLink
              href={GLOBAL_LEADERBOARDS_INVITE_URL}
              prefetch={false}
              event="button_click"
              eventParams={{
                location: "results_dialog_leaderboards_banner",
                action: "join_global_leaderboards",
                mode,
                date,
              }}
            >
              Join Now
            </TrackedLink>
          </Button>
        ) : (
          <div className="mt-6 flex w-full max-w-sm gap-2">
            <Button
              asChild
              className="text-saltong-purple-300 flex-1 bg-[#3f236e] hover:bg-[#4b2a84] hover:text-[#dbc9ff]"
            >
              <TrackedLink
                href="/auth?signup=1"
                prefetch={false}
                event="button_click"
                eventParams={{
                  location: "results_dialog_leaderboards_banner",
                  action: "create_account",
                  mode,
                  date,
                }}
              >
                Create Account
              </TrackedLink>
            </Button>

            <Button asChild variant="outline" className="flex-1 bg-white/10">
              <TrackedLink
                href="/auth"
                prefetch={false}
                event="button_click"
                eventParams={{
                  location: "results_dialog_leaderboards_banner",
                  action: "login",
                  mode,
                  date,
                }}
              >
                Login
              </TrackedLink>
            </Button>
          </div>
        )}

        {!isAuthenticated && (
          <p className="mt-3 text-xs font-semibold tracking-[-0.02em] text-[#f3ecff]">
            Saltong account required.
          </p>
        )}
      </div>
    </div>
  );
}
