import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import SignupForm from "./signup-form";

// TODO: Redirect to dynamic page after login
export default function LoginPage() {
  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_1fr] bg-muted">
      <Navbar>
        <NavbarBrand
          title="Saltong"
          subtitle="Hub"
          icon="/hub-light.svg"
          iconLight="/hub.svg"
        />
      </Navbar>
      <div className="flex h-full w-full items-center justify-center px-4">
        <SignupForm />
      </div>
    </div>
  );
}
