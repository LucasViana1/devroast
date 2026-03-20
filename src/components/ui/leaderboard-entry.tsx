import { forwardRef, type HTMLAttributes } from "react";

import { tv, type VariantProps } from "tailwind-variants";

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

const LeaderboardEntry = forwardRef<HTMLDivElement, LeaderboardEntryProps>(
  ({ className, rank, score, language, code, ...props }, ref) => {
    const codeLines = code.split("\n");
    const lineCount = codeLines.length;

    return (
      <div ref={ref} className={cn(entryVariants({ className }))} {...props}>
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
        <div className="flex h-[120px] bg-bg-input">
          <div className="flex w-10 flex-col items-end border-r border-border-primary bg-surface px-2.5 py-3.5 font-primary text-[13px] leading-[22px] text-text-tertiary">
            {codeLines.slice(0, 5).map((_line, lineIndex) => (
              // biome-ignore lint: line numbers are sequential and unique
              <span key={`ln-${lineIndex}`}>{lineIndex + 1}</span>
            ))}
            {codeLines.length > 5 && <span className="text-accent-amber/50">...</span>}
          </div>
          <pre className="flex-1 overflow-hidden p-4 font-primary text-[13px] leading-[22px] text-text-primary">
            <code>
              {codeLines.slice(0, 5).join("\n")}
              {codeLines.length > 5 && "\n..."}
            </code>
          </pre>
        </div>
      </div>
    );
  }
);

LeaderboardEntry.displayName = "LeaderboardEntry";

export { entryVariants, LeaderboardEntry, metaRowVariants };
