import { LeaderboardSkeleton } from "@/components/skeletons/leaderboard-skeleton";

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col bg-bg-page">
      <div className="mx-auto w-full max-w-5xl px-10 py-10">
        <section className="mb-10">
          <h1 className="mb-4 flex items-center gap-3 font-primary text-[28px] font-bold text-text-primary">
            <span className="text-accent-green">&gt;</span>
            shame_leaderboard
          </h1>
          <p className="mb-3 font-secondary text-sm text-text-secondary">
            {"// the most roasted code on the internet"}
          </p>
        </section>

        <LeaderboardSkeleton />
      </div>
    </main>
  );
}
