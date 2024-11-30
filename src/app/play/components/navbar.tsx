import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

const Navbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <nav
      ref={ref}
      className={cn(
        "sticky top-0 z-10 border-b bg-background/20 backdrop-blur-md",
        className
      )}
      {...props}
    >
      <div className="container flex max-w-[1800px] justify-between px-3 py-2 lg:px-6">
        {children}
      </div>
    </nav>
  );
});
Navbar.displayName = "Navbar";

const navbarBrandTitleVariants = cva("", {
  variants: {
    colorScheme: {
      green: "text-saltong-green",
      purple: "text-saltong-purple",
      blue: "text-saltong-blue",
      red: "text-saltong-red",
      default: "text-black",
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

export interface NavbarBrandProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof navbarBrandTitleVariants> {
  title?: string;
  subtitle?: string;
  boxed?: string;
}

const NavbarBrand = React.forwardRef<HTMLDivElement, NavbarBrandProps>(
  (
    { className, children, colorScheme, title, subtitle, boxed, ...props },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("flex items-center", className)} {...props}>
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
