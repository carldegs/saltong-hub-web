import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GameNotFound() {
  return (
    <>
      <Navbar
      // colorScheme={
      //   colorScheme as ComponentProps<typeof Navbar>["colorScheme"]
      // }
      >
        <div className="flex items-center gap-2">
          <NavbarBrand
            // colorScheme={
            //   colorScheme as ComponentProps<typeof Navbar>["colorScheme"]
            // }
            title="Saltong"
            subtitle="Hub"
            icon={"/hub.svg"}
            href="/"
            prefetch={false}
          />
        </div>
      </Navbar>
      <div className="flex h-full w-full items-center justify-center px-4">
        <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/404.jpg" alt="404" className="w-96 rounded-lg" />
          <h3 className="text-center text-3xl font-bold">Page Not Found</h3>
          <span className="text-muted-foreground base:text-base text-center md:text-lg">
            The page you&apos;re looking for doesn&apos;t exist. It might have
            been removed or never existed in the first place.
            <br />
            <br />
            In the meantime:
          </span>
          <div className="base:flex-col flex w-full gap-4 md:flex-row">
            <Button className="flex-1" asChild>
              <Link href="./vault" prefetch={false}>
                View Vault
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
    // <div>
    //   <h2>Not Found</h2>
    //   <p>Could not find requested resource</p>
    //   <Link href="/">Return Home</Link>
    // </div>
  );
}
