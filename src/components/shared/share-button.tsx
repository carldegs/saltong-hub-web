import { ComponentProps } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function ShareButton({
  onClick,
  icon,
  label,
  className,
}: {
  onClick: ComponentProps<typeof Button>["onClick"];
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center",
        className
      )}
    >
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
