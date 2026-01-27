import { ComponentProps } from "react";
import { Button } from "../ui/button";

export default function ShareButton({
  onClick,
  icon,
  label,
}: {
  onClick: ComponentProps<typeof Button>["onClick"];
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Button
        variant="default"
        className="size-12 rounded-full p-1"
        onClick={onClick}
      >
        {icon}
      </Button>
      <div className="mt-2 w-full text-center text-sm">{label}</div>
    </div>
  );
}
