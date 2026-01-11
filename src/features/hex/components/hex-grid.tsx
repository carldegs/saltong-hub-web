import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { CircleOffIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

const hexVariants = cva(
  "w-[80px] md:w-[100px] cursor-pointer text-saltong-purple-200 dark:text-saltong-purple/30 hover:text-saltong-purple-600 dark:hover:text-saltong-purple/60 transition-colors",
  {
    variants: {
      center: {
        true: "text-saltong-purple dark:text-saltong-purple",
      },
    },
    defaultVariants: {
      center: false,
    },
  }
);

const Hex = ({
  value,
  onClick,
  center,
  disabled,
  ...props
}: Omit<React.ComponentProps<"svg">, "children" | "onClick" | "center"> & {
  value: string;
  onClick: (value: string) => void;
  center?: boolean;
  disabled?: boolean;
}) => {
  const isEmpty = !value;

  const hexElement = (
    <div
      className={cn("relative flex items-center justify-center", {
        "pointer-events-none": disabled || !value,
        "opacity-50": disabled,
      })}
      onClick={() => {
        if (!disabled) {
          onClick(value);
        }
      }}
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 173.20508075688772 200"
        className={cn(hexVariants({ center }))}
        {...props}
      >
        <path
          fill={value ? "currentColor" : "none"}
          stroke={value ? "none" : "currentColor"}
          strokeWidth={value ? 0 : 2}
          strokeDasharray={value ? "0" : "8 4"}
          d="M79.67433714816835 3.9999999999999996Q86.60254037844386 0 93.53074360871938 3.9999999999999996L166.27687752661222 46Q173.20508075688772 50 173.20508075688772 58L173.20508075688772 142Q173.20508075688772 150 166.27687752661222 154L93.53074360871938 196Q86.60254037844386 200 79.67433714816835 196L6.92820323027551 154Q0 150 0 142L0 58Q0 50 6.92820323027551 46Z"
        ></path>
      </svg>
      <span className="absolute mt-0 cursor-pointer text-4xl font-bold opacity-80 select-none">
        {value?.toUpperCase() ?? (
          <CircleOffIcon size={20} className="text-saltong-purple" />
        )}
      </span>
    </div>
  );

  if (isEmpty) {
    console.log("EMPTY");
    return (
      <Tooltip>
        <TooltipTrigger>{hexElement}</TooltipTrigger>
        <TooltipContent>This round only has 6 letters</TooltipContent>
      </Tooltip>
    );
  }

  return hexElement;
};

const rowVariants = cva("flex justify-center gap-2", {
  variants: {
    center: {
      true: "my-[-17px] md:my-[-22px]",
    },
  },
  defaultVariants: {
    center: false,
  },
});

export default function HexGrid({
  letters,
  centerLetter,
  onClick,
  isDisabled,
}: {
  letters: string[];
  centerLetter: string;
  onClick: (_letter: string) => void;
  isDisabled?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div className={cn(rowVariants())}>
        <Hex
          value={letters?.[0]?.toUpperCase()}
          onClick={onClick}
          disabled={isDisabled}
        />
        <Hex
          value={letters?.[1]?.toUpperCase()}
          onClick={onClick}
          disabled={isDisabled}
        />
      </div>
      <div className={cn(rowVariants({ center: true }))}>
        <Hex
          value={letters?.[2]?.toUpperCase()}
          onClick={onClick}
          disabled={isDisabled}
        />
        <Hex
          value={centerLetter?.toUpperCase()}
          onClick={onClick}
          center={true}
          disabled={isDisabled}
        />
        <Hex
          value={letters?.[3]?.toUpperCase()}
          onClick={onClick}
          disabled={isDisabled}
        />
      </div>
      <div className={cn(rowVariants())}>
        <Hex
          value={letters?.[4]?.toUpperCase()}
          onClick={onClick}
          disabled={isDisabled}
        />
        <Hex
          value={letters?.[5]?.toUpperCase()}
          onClick={onClick}
          disabled={isDisabled}
        />
      </div>
    </div>
  );
}
