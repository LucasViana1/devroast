import { type HTMLAttributes } from "react";

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

export function ScoreRing({ className, score, maxScore = 10, ...props }: ScoreRingProps) {
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 82;
  const dashOffset = circumference - (percentage / 100) * circumference;

  const getScoreColor = () => {
    if (score < 3) return "#EF4444";
    if (score < 6) return "#F59E0B";
    return "#22C55E";
  };

  const scoreColor = getScoreColor();

  return (
    <div className={cn(scoreRingVariants({ className }))} {...props}>
      <svg
        className="w-[180px] h-[180px] -rotate-90"
        viewBox="0 0 180 180"
        aria-label={`Score: ${score} out of ${maxScore}`}
      >
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="35%" stopColor="#EF4444" />
            <stop offset="36%" stopColor="#F59E0B" />
            <stop offset="36%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>

        <circle
          cx="90"
          cy="90"
          r="82"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-border-primary"
        />

        <circle
          cx="90"
          cy="90"
          r="82"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="4"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-primary text-5xl font-bold" style={{ color: scoreColor }}>
          {score.toFixed(1)}
        </span>
        <span className="font-primary text-base text-text-tertiary">/10</span>
      </div>
    </div>
  );
}
