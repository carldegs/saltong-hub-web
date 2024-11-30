import { ColorModeToggle } from "@/components/shared/color-mode-toggle";
import { ResultsButton } from "./results-button";
import NavbarDrawerButton from "../../components/navbar-drawer-button";

export default function NavbarActions() {
  return (
    <div className="flex gap-2">
      {/* <ResultsButton /> */}
      {/* <ColorModeToggle /> */}
      <NavbarDrawerButton />
    </div>
  );
}
