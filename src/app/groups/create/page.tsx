import HomeNavbarBrand from "@/app/components/home-navbar-brand";
import { Navbar } from "@/components/shared/navbar";
import CreateGroupForm from "@/features/groups/components/create-group-form";

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
