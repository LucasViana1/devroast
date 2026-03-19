import { forwardRef, type HTMLAttributes } from "react";

import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

const cardVariants = tv({
  base: "border border-border-primary bg-transparent p-5 flex flex-col gap-3",
});

const cardHeaderVariants = tv({
  base: "flex items-center gap-2",
});

const cardTitleVariants = tv({
  base: "font-primary text-[13px] font-normal text-text-primary",
});

const cardDescriptionVariants = tv({
  base: "font-primary text-xs text-text-secondary",
});

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(cardVariants({ className }))} {...props} />;
});

Card.displayName = "Card";

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(cardHeaderVariants({ className }))} {...props} />;
});

CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({ className, ...props }, ref) => {
  return <h3 ref={ref} className={cn(cardTitleVariants({ className }))} {...props} />;
});

CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(cardDescriptionVariants({ className }))}
        style={{ lineHeight: 1.5, ...style }}
        {...props}
      />
    );
  }
);

CardDescription.displayName = "CardDescription";

export { Card, CardHeader, CardTitle, CardDescription };
