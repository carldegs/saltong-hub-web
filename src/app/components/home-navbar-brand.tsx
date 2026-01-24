"use client";
import { NavbarBrand } from "@/components/shared/navbar";
import { useSidebar } from "@/components/ui/sidebar";

export default function HomeNavbarBrand({
  hideMenu = false,
  hideBrand,
}: {
  hideMenu?: boolean;
  hideBrand?: boolean;
}) {
  const { open, isMobile } = useSidebar();
  return (
    <NavbarBrand
      title="Saltong"
      subtitle="Hub"
      icon="/hub-light.svg"
      iconLight="/hub.svg"
      hideBrand={hideBrand ?? (open && !isMobile)}
      hideMenu={hideMenu}
      href="/"
      prefetch={false}
      forceLarge
    />
  );
}
