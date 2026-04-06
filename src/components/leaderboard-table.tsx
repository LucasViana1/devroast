import { sql } from "drizzle-orm";
import { cacheLife } from "next/cache";
import { db } from "@/db";
import { roasts, submissions } from "@/db/schema";
import { LeaderboardTableUI } from "./leaderboard-table-ui";

export default async function LeaderboardTable() {
  "use cache";
  cacheLife("hours");

  const totalRoastsResult = await db.execute<{ count: number }>(
    sql`SELECT COUNT(*) as count FROM ${roasts}`
  );
  const totalRoasts = totalRoastsResult[0]?.count ?? 0;

  const leaderboardResult = await db.execute<{
    id: string;
    code: string;
    language: string;
    score: number;
  }>(
    sql`
      SELECT 
        s.id,
        s.code,
        s.language,
        r.score
      FROM ${submissions} s
      INNER JOIN ${roasts} r ON r.submission_id = s.id
      ORDER BY r.score ASC
      LIMIT 20
    `
  );

  const entries = leaderboardResult.map((row, index) => ({
    rank: index + 1,
    id: row.id,
    code: row.code,
    language: row.language,
    score: row.score / 10,
  }));

  const data = {
    entries,
    totalRoasts,
  };

  return <LeaderboardTableUI data={data} />;
}
