import { forwardRef, type HTMLAttributes } from "react";

import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const issueCardVariants = tv({
  base: "flex flex-col gap-3 p-5 border border-border-primary bg-surface",
});

const severityVariants = tv({
  base: "flex items-center gap-2",
  variants: {
    severity: {
      info: "text-accent-cyan",
      warning: "text-accent-amber",
      error: "text-accent-red",
      critical: "text-accent-red",
    },
  },
});

export interface IssueCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof issueCardVariants> {
  severity: "info" | "warning" | "error" | "critical";
  line?: number;
  message: string;
  suggestion?: string;
}

const IssueCard = forwardRef<HTMLDivElement, IssueCardProps>(
  ({ className, severity, line, message, suggestion, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(issueCardVariants({ className }))} {...props}>
        <div className="flex items-center justify-between">
          <div className={severityVariants({ severity })}>
            <span className="h-2 w-2 rounded-full bg-current" />
            <span className="font-primary text-xs font-medium uppercase tracking-wide">
              {severity}
            </span>
          </div>
          {line && <span className="font-primary text-xs text-text-tertiary">line {line}</span>}
        </div>
        <p className="font-primary text-sm text-text-primary">{message}</p>
        {suggestion && <p className="font-secondary text-xs text-text-secondary">{suggestion}</p>}
      </div>
    );
  }
);

IssueCard.displayName = "IssueCard";

export { IssueCard, issueCardVariants, severityVariants };
