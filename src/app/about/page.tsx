import React from "react";
import type { Metadata } from "next";
import getConfig from "next/config";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";
import CarldegsLogo from "@/components/shared/carldegs-logo";
import ContributeDialog from "@/components/shared/contribute-dialog";
import { Navbar } from "@/components/shared/navbar";
import HomeNavbarBrand from "../components/home-navbar-brand";

export const metadata: Metadata = {
  title: "About Saltong Hub",
  description:
    "Learn about Saltong Hub, the platform for Filipino word games. Created with passion to celebrate the Filipino language through engaging daily puzzles and community gameplay.",
  openGraph: {
    title: "About Saltong Hub",
    description:
      "Learn about Saltong Hub, the platform for Filipino word games created to celebrate the Filipino language.",
    type: "website",
    url: "https://saltong.com/about",
  },
};

export default function AboutPage() {
  const { publicRuntimeConfig } = getConfig();
  return (
    <>
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main className="dark:from-background dark:via-muted/60 dark:to-muted/80 relative flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] py-0 sm:py-8">
        <Card className="sm:bg-background w-full rounded-none bg-none pb-0 sm:mx-4 sm:max-w-xl sm:rounded-lg">
          <CardHeader className="items-center">
            <CardTitle className="text-center text-3xl font-bold tracking-tight">
              Saltong Hub
            </CardTitle>
            <CardDescription className="mt-1 text-center text-base">
              v{publicRuntimeConfig?.version}
            </CardDescription>
          </CardHeader>
          <CardContent className="mb-8 flex flex-col items-center gap-4">
            <div className="space-y-2 text-center">
              <p>
                <b>Saltong</b>, <b>Saltong Mini</b>, and <b>Saltong Max</b> is
                based on the word game{" "}
                <a
                  href="https://www.nytimes.com/games/wordle/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Wordle
                </a>{" "}
                <sup>↗</sup>
              </p>
              <p>
                <b>Saltong Hex</b> is based on the New York Times game{" "}
                <a
                  href="https://www.nytimes.com/puzzles/spelling-bee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Spelling Bee
                </a>{" "}
                <sup>↗</sup>
              </p>
              <p>
                Word list parsed from{" "}
                <a
                  href="https://www.pinoydictionary.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  pinoydictionary.com
                </a>
              </p>
              <p>Additional entries sourced from you!</p>
            </div>
            <hr className="border-muted my-2 w-full" />
            <div className="text-muted-foreground text-center text-sm">
              Saltong Hub depends on your contributions to keep the site running
            </div>
            <ContributeDialog>
              <Button className="w-full" variant="default">
                Contribute
              </Button>
            </ContributeDialog>
            <hr className="border-muted my-2 w-full" />
            <div className="text-muted-foreground mb-2 text-center text-xs tracking-widest">
              A PROJECT BY CARL DE GUIA
            </div>
            <div className="flex flex-col items-center gap-2">
              <CarldegsLogo className="mb-4 h-8" />
              <div className="flex gap-2">
                <a
                  href="https://github.com/carldegs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Github size={16} /> GitHub
                  </Button>
                </a>
                <a
                  href="https://www.linkedin.com/in/carl-justin-de-guia-b40a1b97/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Linkedin size={16} /> LinkedIn
                  </Button>
                </a>
                <a href="mailto:carl@carldegs.com">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Mail size={16} /> Email
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
