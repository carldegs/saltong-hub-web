import type { Metadata } from "next";
import Link from "next/link";
import HomeNavbarBrand from "@/app/components/home-navbar-brand";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { canonicalUrl, pageIndexingMetadata } from "@/lib/seo";
import { FILIPINO_WORDLE_LANDING_COPY } from "./copy";

export const metadata: Metadata = {
  title: FILIPINO_WORDLE_LANDING_COPY.title,
  description: FILIPINO_WORDLE_LANDING_COPY.description,
  ...pageIndexingMetadata("/filipino-wordle", true),
  openGraph: {
    title: FILIPINO_WORDLE_LANDING_COPY.title,
    description: FILIPINO_WORDLE_LANDING_COPY.description,
    type: "website",
    url: canonicalUrl("/filipino-wordle"),
  },
};

export default function FilipinoWordlePage() {
  return (
    <>
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main>
        <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:py-20">
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              {FILIPINO_WORDLE_LANDING_COPY.eyebrow}
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {FILIPINO_WORDLE_LANDING_COPY.hero}
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
              {FILIPINO_WORDLE_LANDING_COPY.introduction}
            </p>
            <Button asChild size="lg">
              <Link href="/play">{FILIPINO_WORDLE_LANDING_COPY.playLabel}</Link>
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>How Saltong began</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                {FILIPINO_WORDLE_LANDING_COPY.story}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {FILIPINO_WORDLE_LANDING_COPY.independenceNotice}
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
