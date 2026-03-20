import { sql } from "drizzle-orm";
import { roasts, submissions } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  stats: createTRPCRouter({
    getGlobal: baseProcedure.query(async ({ ctx }) => {
      const totalResult = await ctx.db.execute<{ count: number }>(
        sql`SELECT COUNT(*) as count FROM ${submissions}`
      );
      const totalSubmissions = totalResult[0]?.count ?? 0;

      const avgResult = await ctx.db.execute<{ avg: number | null }>(
        sql`
          SELECT AVG(
            CASE 
              WHEN severity = 'critical' THEN 1
              WHEN severity = 'error' THEN 2
              WHEN severity = 'warning' THEN 3
              WHEN severity = 'info' THEN 4
              ELSE 3
            END
          ) as avg FROM ${roasts}
        `
      );
      const avgSeverity = avgResult[0]?.avg ?? 3;

      const normalizedScore = Math.max(0, Math.min(10, 10 - ((avgSeverity - 1) / 3) * 10));

      return {
        totalSubmissions,
        avgScore: Math.round(normalizedScore * 10) / 10,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
