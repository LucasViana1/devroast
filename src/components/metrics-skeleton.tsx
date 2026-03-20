import { tv } from "tailwind-variants";

const skeletonVariants = tv({
  base: "bg-bg-surface animate-pulse rounded",
});

export function MetricsSkeleton() {
  return (
    <div className="flex items-center justify-center gap-6 font-secondary text-xs text-text-tertiary">
      <div className="flex items-center gap-2">
        <div className={`h-4 w-16 ${skeletonVariants()}`} />
        <span>codes roasted</span>
      </div>
      <span>·</span>
      <div className="flex items-center gap-2">
        <div className={`h-4 w-10 ${skeletonVariants()}`} />
        <span>avg score</span>
      </div>
    </div>
  );
}
