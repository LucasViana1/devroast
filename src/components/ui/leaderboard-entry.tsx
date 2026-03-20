import { type HTMLAttributes } from "react";

import { tv, type VariantProps } from "tailwind-variants";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";

const entryVariants = tv({
  base: "overflow-hidden rounded-none border border-border-primary",
});

const metaRowVariants = tv({
  base: "flex h-12 items-center justify-between border-b border-border-primary bg-surface px-5",
});

export interface LeaderboardEntryProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof entryVariants> {
  rank: number;
  score: number;
  language: string;
  code: string;
}

export function LeaderboardEntry({
  className,
  rank,
  score,
  language,
  code,
  ...props
}: LeaderboardEntryProps) {
  const codeLines = code.split("\n");
  const lineCount = codeLines.length;

  return (
    <div className={cn(entryVariants({ className }))} {...props}>
      <div className={metaRowVariants()}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-primary text-[13px] font-normal text-text-tertiary">#</span>
            <span className="font-primary text-[13px] font-bold text-accent-amber">{rank}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-primary text-xs font-normal text-text-tertiary">score:</span>
            <span className="font-primary text-[13px] font-bold text-accent-red">
              {score.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-primary text-xs font-normal text-text-secondary">{language}</span>
          <span className="font-primary text-xs font-normal text-text-tertiary">
            {lineCount} lines
          </span>
        </div>
      </div>
      <div className="h-[120px] overflow-hidden border-t border-border-primary">
        <CodeBlock code={code} lang={language} showHeader={false} showLineNumbers={true} />
      </div>
    </div>
  );
}
