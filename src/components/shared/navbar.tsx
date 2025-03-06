import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import Image from "next/image";
import React from "react";
import { Skeleton } from "../ui/skeleton";

const navbarBrandTitleVariants = cva("", {
  variants: {
    colorScheme: {
      green: "text-saltong-green",
      purple: "text-saltong-purple",
      blue: "text-saltong-blue",
      red: "text-saltong-red",
      default: "text-[#252827] dark:text-[#EFFFF7]",
    },
  },
  defaultVariants: {
    colorScheme: "default",
  },
});

const navbarBrandBoxedVariants = cva("", {
  variants: {
    colorScheme: {
      green: "bg-saltong-green text-saltong-green-200",
      purple: "bg-saltong-purple text-saltong-purple-200",
      blue: "bg-saltong-blue text-saltong-blue-200",
      red: "bg-saltong-red text-saltong-red-200",
      default: "bg-black text-white dark:bg-white dark:text-black",
    },
  },
  defaultVariants: {
    colorScheme: "default",
  },
});

const navbarBackgroundGradientVariants = cva("", {
  variants: {
    colorScheme: {
      green:
        "from-saltong-green-400/20 to-background/20 hover:from-saltong-green-400/30",
      purple:
        "from-saltong-purple-400/20 to-background/20 hover:from-saltong-purple-400/30",
      blue: "from-saltong-blue-400/20 to-background/20 hover:from-saltong-blue-400/30",
      red: "from-saltong-red-400/20 to-background/20 hover:from-saltong-red-400/30",
      default: "background-20",
    },
  },
  defaultVariants: {
    colorScheme: "default",
  },
});

const Navbar = ({
  ref,
  className,
  children,
  colorScheme,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof navbarBackgroundGradientVariants> & {
    ref?: React.RefObject<HTMLDivElement>;
  }) => {
  return (
    <nav
      ref={ref}
      className={cn(
        "sticky top-0 z-10 border-b bg-linear-to-br backdrop-blur-md",
        navbarBackgroundGradientVariants({ colorScheme }),
        className
      )}
      {...props}
    >
      <div className="container flex max-w-[1800px] justify-between py-2 pr-3 pl-1 lg:pr-6 lg:pl-2">
        {children}
      </div>
    </nav>
  );
};
Navbar.displayName = "Navbar";

export interface NavbarBrandProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof navbarBrandTitleVariants> {
  title?: string;
  subtitle?: string;
  boxed?: string;
  icon?: string;
  iconLight?: string;
  hideMenu?: boolean;
  hideBrand?: boolean;
  isLoading?: boolean;
}

const NavbarBrand = ({
  ref,
  className,
  children,
  colorScheme,
  title,
  subtitle,
  boxed,
  icon,
  iconLight,
  hideMenu,
  hideBrand,
  isLoading,
  ...props
}: NavbarBrandProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex min-h-[32px] items-center justify-center gap-1.5",
        className,
        navbarBrandTitleVariants({ colorScheme })
      )}
      {...props}
    >
      {!hideMenu && <SidebarTrigger />}
      {!hideBrand && (
        <>
          {icon && (
            <Image
              src={icon}
              alt={`${title} Logo`}
              width={30}
              height={30}
              className={cn({
                "hidden dark:block": !!iconLight,
              })}
            />
          )}
          {iconLight && (
            <Image
              src={iconLight}
              alt={`${title} Logo`}
              width={30}
              height={30}
              className="block dark:hidden"
            />
          )}
          <h3 className="tracking-tighter select-none">
            {title && (
              <span
                className={cn(
                  navbarBrandTitleVariants({ colorScheme }),
                  "font-[700]"
                )}
              >
                {title}
                {!subtitle && " "}
              </span>
            )}
            {!!subtitle && (
              <span
                className={cn(
                  navbarBrandTitleVariants({ colorScheme }),
                  "font-[300]"
                )}
              >
                {subtitle}{" "}
              </span>
            )}
            {isLoading && (
              <Skeleton
                className={cn(
                  navbarBrandBoxedVariants({ colorScheme }),
                  "inline-block h-[23.5] w-12 rounded-lg px-2 text-lg font-[300]"
                )}
              />
            )}
            {!!boxed && !isLoading && (
              <span
                className={cn(
                  navbarBrandBoxedVariants({ colorScheme }),
                  "rounded-lg px-2 text-lg font-[300]"
                )}
              >
                {boxed}
              </span>
            )}
            {children}
          </h3>
        </>
      )}
    </div>
  );
};
NavbarBrand.displayName = "NavbarBrand";

export { Navbar, NavbarBrand };
