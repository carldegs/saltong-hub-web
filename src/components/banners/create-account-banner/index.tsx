import { CloudCheckIcon, MedalIcon, SwordsIcon, VaultIcon } from "lucide-react";
import { BentoCard, BentoCardProps, BentoGrid } from "../../ui/bento-grid";
import { Ripple } from "../../ui/ripple";
import { NumberTicker } from "../../ui/number-ticker";
import OrbitingCircleIcons from "./orbiting-circle-icons";
import { createClient } from "@/lib/supabase/server";

// MagicUI
// TODO: Check if better to make this a static server component
export default async function CreateAccountBanner() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  const features: BentoCardProps[] = [
    {
      Icon: VaultIcon,
      name: "Access the Vault",
      description:
        "Play all past Saltong puzzles anytime you want and never miss a challenge again.",
      href: data?.claims?.sub ? "/play/vault" : "/auth",
      cta: data?.claims?.sub ? "Play Now" : "Create Account",
      className: "col-span-3 row-span-1 lg:col-span-1 lg:row-span-2",
      background: (
        <div className="bg-background absolute flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border">
          <div className="flex flex-col items-center justify-center opacity-70">
            <NumberTicker
              value={12}
              startValue={27}
              className="-mt-20 text-center text-5xl font-medium tracking-tighter whitespace-pre-wrap dark:text-white"
              delay={1}
              loop
            />
            <span>APRIL</span>
          </div>
          <Ripple className="-mt-20" />
        </div>
      ),
    },
    {
      Icon: CloudCheckIcon,
      name: "Sync Across Devices",
      description:
        "Pick up right where you left off — your progress automatically syncs on all your devices.",
      href: data?.claims?.sub ? "/play" : "/auth",
      cta: data?.claims?.sub ? "Gballs" : "Sign Up",
      className: "col-span-3 lg:col-span-2",
      background: <OrbitingCircleIcons />,
    },
    {
      Icon: SwordsIcon,
      name: "Compete with Friends",
      description:
        "Create a leaderboard with your friends and see who tops the charts.",
      href: data?.claims?.sub ? "#" : "/auth",
      cta: data?.claims?.sub ? "Coming Soooon" : "Taralets!",
      className: "col-span-3 lg:col-span-1",
      background: <></>,
      pill: "COMING SOON",
    },
    {
      Icon: MedalIcon,
      name: "Earn Achievements",
      description: "Collect badges as you reach new milestones.",
      href: data?.claims?.sub ? "#" : "/auth",
      cta: data?.claims?.sub ? "Sandale!" : "Taralets!",
      className: "col-span-3 lg:col-span-1",
      background: <></>,
      pill: "COMING SOON",
    },
  ];
  return (
    <div>
      <div className="mb-6 flex flex-col gap-0">
        <h3>
          {data?.claims?.sub
            ? "Full Saltong Experience Unlocked"
            : "Create a Saltong Account"}
        </h3>
        <span>
          {data?.claims?.sub
            ? "Everything’s saved, synced, and ready. Access past puzzles, track your progress, and see what’s coming next."
            : "Unlock the full Saltong experience. Save your progress, track milestones, and play your way — anywhere, anytime."}
        </span>
      </div>
      <BentoGrid>
        {features.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
}
