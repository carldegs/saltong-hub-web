import type { Metadata } from "next";
import { Linkedin, Mail } from "lucide-react";
import HomeNavbarBrand from "@/app/components/home-navbar-brand";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { canonicalUrl, pageIndexingMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Carl de Guia for Saltong Hub support, bug reports, collaborations, and development work.",
  ...pageIndexingMetadata("/contact", true),
  openGraph: {
    title: "Contact Us",
    description:
      "Contact Saltong Hub for support, feedback, and collaborations.",
    type: "website",
    url: canonicalUrl("/contact"),
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main className="mx-auto flex min-h-[70dvh] w-full max-w-2xl items-center px-4 py-12 sm:px-6">
        <section className="bg-card w-full rounded-xl border p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Found a bug? Need help using the site? Want to discuss
            collaborations or development work? You can contact me through these
            channels.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="gap-2">
              <a href="mailto:hello@carldegs.com">
                <Mail size={16} /> hello@carldegs.com
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <a
                href="https://www.linkedin.com/in/carl-justin-de-guia-b40a1b97/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
