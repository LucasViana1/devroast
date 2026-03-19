import { type ButtonHTMLAttributes, forwardRef } from "react";

import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer font-primary",
  variants: {
    variant: {
      primary: "bg-accent-green text-zinc-950 hover:opacity-90 focus-visible:ring-accent-green",
      secondary:
        "bg-transparent border border-border-primary text-text-primary hover:bg-muted focus-visible:ring-ring",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-primary hover:bg-muted focus-visible:ring-ring",
      link: "text-text-secondary underline-offset-4 hover:underline",
      destructive: "bg-destructive text-white hover:opacity-90 focus-visible:ring-destructive",
    },
    variantSize: {
      primary: "h-auto px-6 py-2.5 text-[13px] font-medium",
      secondary: "h-auto px-4 py-2 text-[12px] font-normal",
      link: "h-auto px-3 py-1.5 text-[12px] font-normal",
    },
  },
  defaultVariants: {
    variant: "primary",
    variantSize: "primary",
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, variantSize, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, variantSize, className }))}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
