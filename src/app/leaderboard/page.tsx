import type { Metadata } from "next";

import { LeaderboardEntry } from "@/components/ui/leaderboard-entry";

export const metadata: Metadata = {
  title: "Shame Leaderboard | devroast",
  description: "The most roasted code on the internet",
};

const mockShameLeaderboard = [
  {
    rank: 1,
    score: 1.2,
    language: "javascript",
    code: `var total = 0;
for (var i = 0; i < items.length; i++) {
  total = total + items[i].price;
}`,
  },
  {
    rank: 2,
    score: 2.3,
    language: "python",
    code: `def get_data():
    cursor.execute("SELECT * FROM users WHERE id = " + user_id)
    return cursor.fetchone()`,
  },
  {
    rank: 3,
    score: 2.9,
    language: "typescript",
    code: `const process = (data: any) => {
  const result: any = [];
  for (let i = 0; i < data.length; i++) {
    result.push(data[i]);
  }
  return result;
};`,
  },
  {
    rank: 4,
    score: 3.4,
    language: "go",
    code: `func GetUser(id string) User {
    rows, _ := db.Query("SELECT * FROM users WHERE id = ?", id)
    defer rows.Close()
    return User{}
}`,
  },
  {
    rank: 5,
    score: 3.8,
    language: "rust",
    code: `fn main() {
    let mut v = Vec::new();
    for i in 0..100 { v.push(i); }
    println!("{:?}", v);
}`,
  },
];

export default function LeaderboardPage() {
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
          <div className="flex items-center gap-2 font-secondary text-xs text-text-tertiary">
            <span>2,847 submissions</span>
            <span>·</span>
            <span>avg score: 4.2/10</span>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          {mockShameLeaderboard.map((entry) => (
            <LeaderboardEntry key={entry.rank} {...entry} />
          ))}
        </section>
      </div>
    </main>
  );
}
