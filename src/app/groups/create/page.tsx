import type { Metadata } from "next";
import HomeNavbarBrand from "@/app/components/home-navbar-brand";
import { Navbar } from "@/components/shared/navbar";
import CreateGroupForm from "@/features/groups/components/create-group-form";

export const metadata: Metadata = {
  title: "Create Group | Saltong Hub",
  description:
    "Create your own group and invite friends to compete together. Build your community and track group leaderboards.",
  openGraph: {
    title: "Create Group | Saltong Hub",
    description:
      "Create your own group and compete with friends on leaderboards.",
    type: "website",
    url: "https://saltong.com/groups/create",
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
