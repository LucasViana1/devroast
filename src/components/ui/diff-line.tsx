import { forwardRef, type HTMLAttributes } from "react";

import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const diffLineVariants = tv({
  base: "flex font-primary text-[13px] py-2 px-4 gap-2",
  variants: {
    type: {
      removed: "bg-diff-removed text-text-secondary",
      added: "bg-diff-added text-text-primary",
      context: "text-text-tertiary",
    },
  },
});

const diffPrefixVariants = tv({
  base: "w-4 flex-shrink-0",
  variants: {
    type: {
      removed: "text-accent-red",
      added: "text-accent-green",
      context: "text-text-tertiary",
    },
  },
});

export interface DiffLineProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof diffLineVariants> {
  prefix?: string;
  content: string;
}

const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
  ({ className, type = "context", prefix = " ", content, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(diffLineVariants({ type, className }))} {...props}>
        <span className={cn(diffPrefixVariants({ type }))}>{prefix}</span>
        <span className="flex-1">{content}</span>
      </div>
    );
  }
);

DiffLine.displayName = "DiffLine";

export { DiffLine, diffLineVariants };
