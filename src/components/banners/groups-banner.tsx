import { Users2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import TrackedLink from "../shared/tracked-link";
import Image from "next/image";

const TO_ADD = ["TROPA", "FAMBAM", "BEBE", "GENG GENG"];

export default function GroupsBanner() {
  return (
    <div className="@container w-full">
      <div className="relative flex w-full flex-col rounded-xl border border-pink-300 bg-linear-to-br from-pink-200 to-pink-100 py-6 @xl:mt-20 @xl:mb-8 dark:from-pink-600/20 dark:to-pink-500/50">
        <VelocityScroll
          defaultVelocity={0.5}
          numRows={2}
          className="hidden text-7xl text-pink-400 select-none md:text-3xl @xl:block dark:text-pink-300/70"
        >
          {TO_ADD.map((name) => (
            <span key={name}>
              CREATE A GROUP. ADD YOUR <i>{name}</i>. COMPETE IN THE
              LEADERBOARDS.{" "}
            </span>
          ))}
        </VelocityScroll>
        <VelocityScroll
          defaultVelocity={0.5}
          numRows={4}
          className="block text-7xl text-pink-400 select-none md:text-3xl @xl:hidden dark:text-pink-300/70"
        >
          {TO_ADD.map((name) => (
            <span key={name}>
              CREATE A GROUP. ADD YOUR <i>{name}</i>. COMPETE IN THE
              LEADERBOARDS.{" "}
            </span>
          ))}
        </VelocityScroll>
        <div className="flex flex-col items-center justify-center gap-0 pt-4 @xl:flex-row">
          <div className="relative h-[0px] w-[220px] @xl:w-[300px]">
            <Image
              src="/groups-banner-phone.png"
              alt=""
              width={280}
              height={500}
              className={
                "pointer-events-none absolute top-[-265px] right-0 hidden animate-[float_6s_ease-in-out_infinite] select-none @xl:block"
              }
            />
            <Image
              src="/groups-banner-phone.png"
              alt=""
              width={220}
              height={300}
              className={
                "pointer-events-none absolute top-[-350px] right-0 block animate-[float_6s_ease-in-out_infinite] select-none @xl:hidden"
              }
            />
          </div>

          <div className="z-2 ml-0 flex flex-col gap-8 px-8 @xl:-ml-5 @xl:p-0">
            <span className="max-w-sm self-start pr-4 text-left text-lg leading-tight tracking-tight text-pink-900 @md:max-w-lg @md:text-left dark:text-pink-100">
              <b>Ready to ignite some heated rivalries?</b> Create a group to
              challenge friends and family, compare daily results, and see who
              really has the best bokabularyo.
            </span>

            <div className="flex gap-4">
              <Button asChild size="lg" className="font-bold tracking-wide">
                <TrackedLink
                  href="/groups/create"
                  prefetch={false}
                  event="button_click"
                  eventParams={{
                    location: "groups_banner",
                    action: "create_group",
                  }}
                >
                  <Users2Icon />
                  CREATE GROUP
                </TrackedLink>
              </Button>
              <Button
                asChild
                size="lg"
                className="font-bold tracking-wide"
                variant="outline"
              >
                <TrackedLink
                  href="/blog/leaderboards-valentines-update"
                  prefetch={false}
                  event="button_click"
                  eventParams={{
                    location: "groups_banner",
                    action: "create_group",
                  }}
                >
                  LEARN MORE
                </TrackedLink>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
