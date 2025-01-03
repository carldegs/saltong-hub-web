import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import Image from "next/image";
import React from "react";

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
      default: "bg-black text-white",
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

const Navbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof navbarBackgroundGradientVariants>
>(({ className, children, colorScheme, ...props }, ref) => {
  return (
    <nav
      ref={ref}
      className={cn(
        "sticky top-0 z-10 border-b bg-gradient-to-br backdrop-blur-md",
        navbarBackgroundGradientVariants({ colorScheme }),
        className
      )}
      {...props}
    >
      <div className="container flex max-w-[1800px] justify-between py-2 pl-1 pr-3 lg:pl-2 lg:pr-6">
        {children}
      </div>
    </nav>
  );
});
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
}

const NavbarBrand = React.forwardRef<HTMLDivElement, NavbarBrandProps>(
  (
    {
      className,
      children,
      colorScheme,
      title,
      subtitle,
      boxed,
      icon,
      iconLight,
      hideMenu,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-1.5",
          className,
          navbarBrandTitleVariants({ colorScheme })
        )}
        {...props}
      >
        {!hideMenu && <SidebarTrigger />}
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
        <h3 className="select-none tracking-tighter">
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
          {subtitle && (
            <span
              className={cn(
                navbarBrandTitleVariants({ colorScheme }),
                "font-[300]"
              )}
            >
              {subtitle}{" "}
            </span>
          )}
          {boxed && (
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
      </div>
    );
  }
);
NavbarBrand.displayName = "NavbarBrand";

export { Navbar, NavbarBrand };
