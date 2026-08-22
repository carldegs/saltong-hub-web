import { DM_Sans } from "next/font/google";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import TrackedLink from "../shared/tracked-link";

const SUDOKU_URL = "/play/sudoku";
const MATHINIK_URL = "/play/mathinik";

const dmSansItalic = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "900"],
  style: "italic",
});

export default function NumbersGamesBanner() {
  return (
    <div className="@container w-full pt-8 @xl:pt-10">
      <section className="relative isolate overflow-visible rounded-[18px] border-2 border-[#eef5ff] bg-[#061124] bg-[radial-gradient(circle_at_18%_34%,_rgba(77,141,255,0.14),_transparent_32%),linear-gradient(117deg,_#102149_0%,_#071226_48%,_#050b16_100%)] shadow-[0_20px_60px_rgba(2,8,23,0.3)]">
        <div className="pointer-events-none absolute inset-0 rounded-[16px] bg-[linear-gradient(130deg,_rgba(88,139,255,0.14)_0%,_transparent_42%)]" />

        <div className="relative grid min-h-[400px] grid-cols-1 items-center px-5 py-10 @md:min-h-[420px] @md:px-8 @xl:min-h-[258px] @xl:grid-cols-2 @xl:gap-8 @xl:px-14 @xl:py-8">
          <div className="relative z-10 mx-auto flex w-full max-w-[42rem] items-center justify-center pt-10 pb-12 @xl:mx-0 @xl:h-full @xl:max-w-none @xl:py-0">
            <div className="pointer-events-none absolute top-[-4%] right-[4%] z-0 w-[22%] max-w-[150px] min-w-[86px] animate-[float_6.4s_ease-in-out_infinite] select-none @xl:top-[-18%] @xl:right-[4%] @xl:w-[24%] @xl:max-w-[150px] @6xl:right-[16%]">
              <Image
                src="/mathinik-3d.png"
                alt=""
                aria-hidden="true"
                width={240}
                height={240}
                className="h-auto w-full rotate-[9deg] drop-shadow-[0_24px_28px_rgba(0,0,0,0.36)]"
              />
            </div>

            <div className="pointer-events-none absolute bottom-[8%] left-[3%] z-20 w-[21%] max-w-[130px] min-w-[82px] animate-[float_7.1s_ease-in-out_infinite] select-none @xl:bottom-[-8%] @xl:left-[-6%] @xl:w-[22%] @xl:max-w-[128px]">
              <Image
                src="/sudoku-3d.png"
                alt=""
                aria-hidden="true"
                width={240}
                height={240}
                className="h-auto w-full rotate-[-13deg] drop-shadow-[0_24px_24px_rgba(55,22,0,0.42)]"
              />
            </div>

            <h2
              className={`${dmSansItalic.className} relative z-10 flex w-fit max-w-full -translate-x-[10%] flex-col -tracking-[0.07em] text-[#4D8DFF] @xl:-translate-x-[18%]`}
            >
              <span className="block text-[clamp(3.05rem,11.35cqw,5.25rem)] leading-[1.04] font-normal whitespace-nowrap @md:text-[clamp(3.75rem,9.9cqw,5.8rem)] @xl:text-[clamp(3.45rem,5.45cqw,5.15rem)]">
                say hello to
              </span>
              <strong className="block translate-x-[22%] translate-y-[-0.2em] text-[clamp(3.4rem,12.7cqw,5.88rem)] leading-[0.93] font-black whitespace-nowrap italic @md:text-[clamp(4.2rem,11.1cqw,6.5rem)] @xl:text-[clamp(3.86rem,6.1cqw,5.77rem)]">
                numbers
              </strong>
            </h2>
          </div>

          <div className="relative z-10 mx-auto flex max-w-[39rem] flex-col items-center gap-6 text-center @xl:mx-0 @xl:items-start @xl:pr-4 @xl:text-left">
            <p className="max-w-[33ch] text-[clamp(1.2rem,3.9cqw,1.8rem)] leading-[1.18] font-normal tracking-normal text-[#D7E6FF] @xl:max-w-[34ch] @xl:text-[clamp(1.35rem,2cqw,1.85rem)]">
              Tired of word games? Say hello to two new(ish) number games to
              test your logic and math skills
            </p>

            <div className="grid w-full max-w-[36rem] grid-cols-2 gap-4 @xl:max-w-[37rem] @xl:gap-6">
              <Button
                asChild
                size="lg"
                className="h-11 rounded-lg bg-[#FF8A00] px-4 text-[clamp(0.875rem,2.7cqw,1.05rem)] font-bold tracking-normal text-[#071226] shadow-none hover:bg-[#f59a1b] hover:text-[#071226] @xl:h-[3.25rem]"
              >
                <TrackedLink
                  href={SUDOKU_URL}
                  prefetch={false}
                  event="button_click"
                  eventParams={{
                    location: "numbers_games_banner",
                    action: "play_sudoku",
                  }}
                >
                  Play Sudoku
                </TrackedLink>
              </Button>

              <Button
                asChild
                size="lg"
                className="h-11 rounded-lg bg-[#42D8D6] px-4 text-[clamp(0.875rem,2.7cqw,1.05rem)] font-bold tracking-normal text-[#071226] shadow-none hover:bg-[#52e3e1] hover:text-[#071226] @xl:h-[3.25rem]"
              >
                <TrackedLink
                  href={MATHINIK_URL}
                  prefetch={false}
                  event="button_click"
                  eventParams={{
                    location: "numbers_games_banner",
                    action: "play_mathinik",
                  }}
                >
                  Play Mathinik
                </TrackedLink>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
