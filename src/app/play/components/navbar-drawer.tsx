import React from "react";
import CarldegsLogo from "@/components/shared/carldegs-logo";
import { ColorModeToggle } from "@/components/shared/color-mode-toggle";
import SocialButton from "@/components/shared/social-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BadgeInfo,
  Github,
  Globe,
  HandCoins,
  Linkedin,
  Mail,
  XIcon,
} from "lucide-react";
// import sendEvent from "@/lib/analytics";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
import { Drawer } from "vaul";

const ContributeDialog = dynamic(
  () => import("@/components/shared/contribute-dialog"),
  { ssr: false }
);

// TODO: forwardRef
function GameButton({
  icon,
  name,
  className,
  ...props
}: {
  icon: string;
  name: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      variant="outline"
      className={cn("h-auto justify-start py-3 hover:text-white", className)}
      {...props}
    >
      <Image
        src={icon}
        alt={`${name} Logo`}
        width={25}
        height={20}
        className="mr-2 rounded-md"
      />
      {name}
    </Button>
  );
}

export default function NavbarDrawer({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (_change: boolean) => void;
  children?: ReactNode;
}) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showContribution, setShowContribution] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <>
      {showContribution && (
        <ContributeDialog
          open={showContribution}
          onOpenChange={setShowContribution}
        />
      )}
      <Drawer.Root
        direction="right"
        open={open}
        onOpenChange={onOpenChange}
        shouldScaleBackground
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <Drawer.Content className="fixed bottom-0 right-0 z-50 mt-24 h-screen w-full overflow-y-auto overflow-x-hidden rounded-l-none bg-background sm:max-w-[480px] sm:rounded-l-xl">
            <div className="h-screen flex-1 overflow-auto rounded-l-xl bg-muted/30 p-6">
              <div className="mx-auto flex h-full max-w-lg flex-col gap-8">
                <Drawer.Close asChild>
                  <Button
                    // size="icon"
                    variant="ghost"
                    className="absolute right-2 top-2 size-8 p-2"
                  >
                    <XIcon className="size-4" />
                  </Button>
                </Drawer.Close>

                {children}

                <section className="flex flex-col gap-2">
                  <h5 className="font-bold">GAMES</h5>
                  <div className="grid grid-cols-2 gap-1.5">
                    <Link href="/play" passHref legacyBehavior>
                      <GameButton
                        icon="/main.png"
                        name="Saltong"
                        className="hover:bg-saltong-green"
                        onClick={() => {
                          onOpenChange(false);
                        }}
                      />
                    </Link>

                    <Link href="/play/max" passHref legacyBehavior>
                      <GameButton
                        icon="/max.png"
                        name="Saltong Max"
                        className="hover:bg-saltong-red"
                        onClick={() => {
                          onOpenChange(false);
                        }}
                      />
                    </Link>

                    <Link href="/play/mini" passHref legacyBehavior>
                      <GameButton
                        icon="/mini.png"
                        name="Saltong Mini"
                        className="hover:bg-saltong-blue"
                        onClick={() => {
                          onOpenChange(false);
                        }}
                      />
                    </Link>

                    <Link href="/play/hex" passHref legacyBehavior>
                      <GameButton
                        icon="/hex.png"
                        name="Hex"
                        className="hover:bg-saltong-purple"
                        onClick={() => {
                          onOpenChange(false);
                        }}
                      />
                    </Link>

                    <a
                      href="https://balitaoftheweek.com"
                      className="col-span-2 w-full"
                      target="_blank"
                    >
                      <GameButton
                        icon="/botw.png"
                        name="Balita of the Week"
                        className="w-full hover:bg-[#334155]"
                        onClick={() => {
                          onOpenChange(false);
                        }}
                      />
                    </a>
                  </div>
                </section>

                <section className="flex flex-col gap-2">
                  <h5 className="font-bold">SETTINGS</h5>
                  <div className="flex items-center justify-between">
                    <p>Color Mode</p>
                    <ColorModeToggle />
                  </div>
                </section>

                <section className="flex flex-col gap-2">
                  <h5 className="font-bold">MORE</h5>

                  <Button
                    className="h-auto justify-start bg-cyan-100 text-cyan-700 hover:bg-cyan-300 dark:bg-cyan-900/20 dark:text-cyan-100 dark:hover:bg-cyan-900"
                    variant="secondary"
                    onClick={() => {
                      setShowContribution(true);
                      onOpenChange(false);
                      // sendEvent("open_contribute", {
                      //   source: "navbar_drawer",
                      //   path: pathname,
                      //   searchParams: searchParams.toString(),
                      // });
                    }}
                  >
                    <HandCoins className="mr-3 size-4" />
                    <div className="flex flex-col items-start text-center">
                      <span>Enjoyed the app?</span>
                      <span className="opacity-60">Contribute if you can!</span>
                    </div>
                  </Button>

                  <Link href="/privacy" passHref legacyBehavior>
                    <Button
                      className="h-auto justify-start bg-violet-100 text-violet-700 hover:bg-violet-300 dark:bg-violet-900/20 dark:text-violet-100 dark:hover:bg-violet-900"
                      variant="secondary"
                    >
                      <BadgeInfo className="mr-3 size-4" />
                      Privacy Policy
                    </Button>
                  </Link>
                </section>

                <div className="h-full flex-grow-[1]" />

                <section className="flex flex-col justify-center gap-1 pb-2">
                  <p className="text-center text-sm font-light tracking-widest">
                    A PROJECT BY <span className="font-bold">CARL DE GUIA</span>
                  </p>

                  <a
                    href="https://carldegs.com"
                    target="_blank"
                    className="mx-auto"
                    onClick={() => {
                      // sendEvent("contact", {
                      //   type: "website",
                      // });
                    }}
                  >
                    <Button
                      variant="ghost"
                      className="h-auto hover:animate-pulse"
                    >
                      <CarldegsLogo className="mx-auto w-full max-w-[150px]" />
                    </Button>
                  </a>

                  <div className="mt-1 flex justify-center gap-4">
                    <SocialButton
                      icon={<Globe className="size-5" />}
                      url="https://carldegs.com"
                      title="Website"
                      description="Warning! Still under construction!"
                    />

                    <SocialButton
                      icon={<Github className="size-5" />}
                      url="https://github.com/carldegs"
                      title="GitHub"
                      description="Check out all my unfinished projects"
                    />

                    <SocialButton
                      icon={<Linkedin className="size-5" />}
                      url="https://www.linkedin.com/in/carl-justin-de-guia-b40a1b97/"
                      title="LinkedIn"
                      description="Connect with me on LinkedIn"
                    />

                    <SocialButton
                      icon={<Mail className="size-5" />}
                      url="mailto:carl@carldegs.com"
                      title="Email"
                      description="carl@carldegs.com (yes. it's weird)"
                    />
                  </div>

                  <p className="absolute bottom-6 right-6 opacity-30 hover:opacity-100">
                    v{process.env.APP_VERSION}
                  </p>
                </section>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
