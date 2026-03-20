"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { AnimatedNumber } from "./animated-number";

export function GlobalStats() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.stats.getGlobal.queryOptions());

  return (
    <div className="flex items-center justify-center gap-6 font-secondary text-xs text-text-tertiary">
      <span>
        <AnimatedNumber value={data?.totalSubmissions ?? 0} /> codes roasted
      </span>
      <span>·</span>
      <span>
        avg score: <AnimatedNumber value={data?.avgScore ?? 0} />
      </span>
    </div>
  );
}
