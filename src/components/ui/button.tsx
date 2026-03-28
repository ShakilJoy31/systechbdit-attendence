import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useFontShifter } from "@/hooks/useFontShifter";

const buttonVariants = cva(
  "!cursor-pointer inline-flex !leading-5  items-center dark:bg-background dark:text-gray-300 justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background text-foreground hover:bg-muted hover:text-muted-foreground",
        primary: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        tertiary: "bg-tertiary text-tertiary-foreground hover:bg-tertiary/80",
        warning: "bg-warning text-warning-foreground hover:bg-warning/80",
        success: "bg-success text-success-foreground hover:bg-success/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        viewSeat: "bg-[#B642C5] text-white font-semibold",
      },
      shape: {
        default: "rounded-md",
        rounded: "rounded-lg",
        square: "rounded-none",
        pill: "rounded-full",
      },
      size: {
        default: "h-9 px-6 py-1.5 text-[18px]",
        menu: "h-9 px-3 py-1.5 text-[16px]",
        xs: "h-7, text-[16px] px-2 py-0.5 font-normal",
        sm: "h-9 px-3",
        lg: "h-11  px-8",
        icon: "p-[6px] w-9 h-9",
        square:
          "size-[50px] !p-0 drop-shadow-sm bg-secondary/5 text-secondary/80 hover:bg-secondary/10 hover:text-secondary/90",
      },
      gradient: {
        default: "",
        primary:
          "bg-gradient-to-tr from-primary to-tertiary text-primary-foreground hover:from-primary/50 hover:to-tertiary/50 hover:bg-gradient-to-tr hover:text-primary-foreground",
        secondary:
          "bg-gradient-to-tr from-secondary to-white text-secondary-foreground hover:from-secondary/50 hover:to-white/50 hover:bg-gradient-to-tr hover:text-secondary-foreground",
        tertiary:
          "bg-gradient-to-tr from-tertiary to-white text-tertiary-foreground hover:from-tertiary/50 hover:to-white/50 hover:bg-gradient-to-tr hover:text-tertiary-foreground",
        success:
          "bg-gradient-to-tr from-success to-primary text-success-foreground hover:from-success/50 hover:to-primary/50 hover:bg-gradient-to-tr hover:text-success-foreground",
        destructive:
          "bg-gradient-to-tr from-destructive to-white text-destructive-foreground hover:from-destructive/50 hover:to-white/50 hover:bg-gradient-to-tr hover:text-destructive-foreground",
        warning:
          "bg-gradient-to-tr from-warning to-white text-warning-foreground hover:from-warning/50 hover:to-white/50 hover:bg-gradient-to-tr hover:text-warning-foreground",
      },
    },
    defaultVariants: {
      shape: "default",
      variant: "default",
      size: "default",
      gradient: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, shape, gradient, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, shape, gradient, className }),
          useFontShifter()
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
