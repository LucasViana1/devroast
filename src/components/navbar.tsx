import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-primary bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-primary text-lg font-semibold text-text-primary">
            devroast
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/leaderboard"
              className="font-primary text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/exemplos"
              className="font-primary text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Exemplos
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" variantSize="link">
            Log in
          </Button>
          <Button variant="secondary" variantSize="secondary">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
}
