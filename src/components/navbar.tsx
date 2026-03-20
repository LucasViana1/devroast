import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-primary bg-bg-page/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-10">
        <Link
          href="/"
          className="flex items-center gap-2 font-primary text-lg font-medium text-text-primary hover:text-text-primary transition-colors"
        >
          <span className="text-accent-green">&gt;</span>
          devroast
        </Link>
        <Link
          href="/leaderboard"
          className="font-primary text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          leaderboard
        </Link>
      </div>
    </header>
  );
}
