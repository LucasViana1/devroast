import { forwardRef, type HTMLAttributes } from "react";

import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const scoreRingVariants = tv({
  base: "relative flex items-center justify-center",
});

export interface ScoreRingProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scoreRingVariants> {
  score: number;
  maxScore?: number;
}

const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
  ({ className, score, maxScore = 10, ...props }, ref) => {
    const percentage = (score / maxScore) * 100;
    const circumference = 2 * Math.PI * 82;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getScoreColor = () => {
      if (score < 3) return "accent-red";
      if (score < 6) return "accent-amber";
      return "accent-green";
    };

    return (
      <div ref={ref} className={cn(scoreRingVariants({ className }))} {...props}>
        <svg
          className="w-[180px] h-[180px] -rotate-90"
          viewBox="0 0 180 180"
          aria-label={`Score: ${score} out of ${maxScore}`}
        >
          <circle
            cx="90"
            cy="90"
            r="82"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4"
            className="text-border-primary"
          />
          <circle
            cx="90"
            cy="90"
            r="82"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn("transition-all duration-1000", `text-${getScoreColor()}`)}
            style={{
              strokeDashoffset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-primary text-5xl font-bold", `text-${getScoreColor()}`)}>
            {score.toFixed(1)}
          </span>
          <span className="font-primary text-base text-text-tertiary">/10</span>
        </div>
      </div>
    );
  }
);

ScoreRing.displayName = "ScoreRing";

export { ScoreRing, scoreRingVariants };
