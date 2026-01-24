import { VaultIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import TrackedLink from "../shared/tracked-link";

// TODO: Check if better to make this a static server component
export default async function VaultsAlert() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-teal-300 bg-linear-to-br from-teal-200 to-teal-100 py-6 dark:from-teal-600/20 dark:to-teal-500/50">
      <VelocityScroll
        defaultVelocity={1}
        numRows={2}
        className="text-5xl text-teal-400 select-none md:text-6xl dark:text-teal-300/70"
      >
        THE SALTONG VAULT IS <b>UNLOCKED</b>.
      </VelocityScroll>
      <div className="flex w-full max-w-5xl flex-col items-end justify-between gap-8 px-4 pt-8 md:flex-row md:items-center md:px-6 md:pt-16">
        <span className="w-full max-w-sm self-start text-left text-lg leading-tight font-semibold tracking-tight text-teal-900 md:max-w-lg md:text-left dark:text-teal-100">
          Missed a round? You can now play all past Saltong games! <br />
          <br className="inline md:h-0 lg:hidden" />
          Just sign up to get started.
        </span>

        {!data?.claims ? (
          <Button asChild size="lg" className="font-bold tracking-widest">
            <TrackedLink
              href="/auth"
              prefetch={false}
              event="button_click"
              eventParams={{
                location: "vault_banner",
                action: "create_account",
              }}
            >
              CREATE ACCOUNT
            </TrackedLink>
          </Button>
        ) : (
          <Button asChild size="lg" className="font-bold tracking-wide">
            <TrackedLink
              href="/play/vault"
              prefetch={false}
              event="button_click"
              eventParams={{
                location: "vault_banner",
                action: "play_now_vault",
              }}
            >
              <VaultIcon />
              PLAY NOW
            </TrackedLink>
          </Button>
        )}
      </div>
    </div>
  );
}
