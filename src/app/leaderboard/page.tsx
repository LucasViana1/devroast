import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockLeaderboard = [
  { rank: 1, user: "@devmaster", roastsGiven: 892, roastsReceived: 12, score: 9847 },
  { rank: 2, user: "@codeNinja", roastsGiven: 756, roastsReceived: 28, score: 8234 },
  { rank: 3, user: "@rustacean", roastsGiven: 634, roastsReceived: 5, score: 7891 },
  { rank: 4, user: "@typescriptPro", roastsGiven: 589, roastsReceived: 15, score: 7123 },
  { rank: 5, user: "@golangGuru", roastsGiven: 523, roastsReceived: 8, score: 6547 },
  { rank: 6, user: "@pythonMaster", roastsGiven: 478, roastsReceived: 22, score: 5987 },
  { rank: 7, user: "@reactWizard", roastsGiven: 412, roastsReceived: 11, score: 5234 },
  { rank: 8, user: "@vueNinja", roastsGiven: 367, roastsReceived: 19, score: 4567 },
  { rank: 9, user: "@svelteDev", roastsGiven: 298, roastsReceived: 7, score: 3891 },
  { rank: 10, user: "@angularExpert", roastsGiven: 245, roastsReceived: 14, score: 3123 },
];

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="mb-8 font-primary text-3xl font-bold text-text-primary">Leaderboard</h1>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Developer</TableHead>
                <TableHead>Roasts Given</TableHead>
                <TableHead>Roasts Received</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeaderboard.map((entry) => (
                <TableRow key={entry.rank}>
                  <TableCell className="font-medium text-primary">
                    {entry.rank <= 3 ? (
                      <span className="text-accent-amber">
                        {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                      </span>
                    ) : (
                      entry.rank
                    )}
                  </TableCell>
                  <TableCell>{entry.user}</TableCell>
                  <TableCell>{entry.roastsGiven}</TableCell>
                  <TableCell>{entry.roastsReceived}</TableCell>
                  <TableCell className="font-semibold">{entry.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>
    </main>
  );
}
