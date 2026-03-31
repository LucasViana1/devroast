import Link from "next/link";
import { Suspense } from "react";
import { ShameLeaderboard } from "@/components/shame-leaderboard";
import { ShameLeaderboardSkeleton } from "@/components/skeletons/shame-leaderboard-skeleton";
import { Button } from "@/components/ui/button";
import { HomeClient } from "./home-client";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto mb-12 max-w-4xl">
          <div className="mb-3 flex items-center gap-3">
            <span className="font-primary text-4xl font-bold text-accent-green">$</span>
            <span className="font-primary text-4xl font-bold text-text-primary">
              paste your code. get roasted.
            </span>
          </div>

          <p className="mb-8 font-secondary text-sm text-text-secondary">
            {"// drop your code below and we'll rate it — brutally honest or full roast mode"}
          </p>

          <HomeClient />
        </div>

        <section className="mx-auto mt-16 max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-primary text-sm font-bold text-text-primary">
              <span className="text-accent-green">{"//"}</span> shame_leaderboard
            </h2>
            <Button variant="secondary" variantSize="link">
              <Link href="/leaderboard">$ view_all &gt;&gt;</Link>
            </Button>
          </div>

          <p className="mb-6 font-secondary text-xs text-text-tertiary">
            {"// the worst code on the internet, ranked by shame"}
          </p>

          <Suspense fallback={<ShameLeaderboardSkeleton />}>
            <ShameLeaderboard />
          </Suspense>
        </section>
      </section>
    </main>
  );
}
