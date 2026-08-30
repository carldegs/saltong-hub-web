import type { Metadata } from "next";
import HomeNavbarBrand from "@/app/components/home-navbar-brand";
import { Navbar } from "@/components/shared/navbar";
import CreateGroupForm from "@/features/groups/components/create-group-form";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Create Group | Saltong Hub",
  description:
    "Create your own group and invite friends to compete together. Build your community and track group leaderboards.",
  openGraph: {
    title: "Create Group | Saltong Hub",
    description:
      "Create your own group and compete with friends on leaderboards.",
    type: "website",
    url: canonicalUrl("/groups/create"),
  },
};

export default function CreateGroupPage() {
  return (
    <>
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main>
        <CreateGroupForm />
      </main>
    </>
  );
}
