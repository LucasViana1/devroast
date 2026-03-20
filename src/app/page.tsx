import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

          <Card>
            <Table>
              <TableHeader>
                <TableRow className="bg-bg-surface">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead className="w-16">score</TableHead>
                  <TableHead>code</TableHead>
                  <TableHead className="w-24">lang</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-accent-amber">1</TableCell>
                  <TableCell className="font-bold text-accent-red">1.2</TableCell>
                  <TableCell className="font-primary text-xs">
                    <div className="space-y-1">
                      <p>eval(prompt(&quot;enter code&quot;))</p>
                      <p>document.write(response)</p>
                      <p className="text-text-tertiary">{"// trust the user lol"}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-text-secondary">javascript</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-text-secondary">2</TableCell>
                  <TableCell className="font-bold text-accent-red">1.8</TableCell>
                  <TableCell className="font-primary text-xs">
                    <div className="space-y-1">
                      <p>
                        if (x == true) {"{"} return true; {"}"}
                      </p>
                      <p>
                        else if (x == false) {"{"} return false; {"}"}
                      </p>
                      <p>
                        else {"{"} return !false; {"}"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-text-secondary">typescript</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-text-secondary">3</TableCell>
                  <TableCell className="font-bold text-accent-red">2.1</TableCell>
                  <TableCell className="font-primary text-xs">
                    <div className="space-y-1">
                      <p>SELECT * FROM users WHERE 1=1</p>
                      <p className="text-text-tertiary">-- TODO: add authentication</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-text-secondary">sql</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>

          <p className="mt-4 text-center font-secondary text-xs text-text-tertiary">
            showing top 3 of 2,847 ·{" "}
            <Link href="/leaderboard" className="text-text-secondary hover:underline">
              view full leaderboard &gt;&gt;
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
}
