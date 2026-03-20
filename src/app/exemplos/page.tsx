"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { Badge, BadgeDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";

export default function ExemplosPage() {
  const [code, setCode] = useState("");

  const sampleCode = `function calculateTotal() {
  let total = 0;
  for (const item of items) {
    total += item.price;
  }
  return total;
}`;

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Buttons */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" variantSize="primary">
              roast_my_code
            </Button>
            <Button variant="secondary" variantSize="secondary">
              share_roast
            </Button>
            <Button variant="link" variantSize="link">
              view_all &gt;&gt;
            </Button>
          </div>
        </section>

        {/* Toggle */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Toggle</h2>
          <div className="flex flex-wrap items-center gap-6">
            <Toggle size="md" checked>
              roast mode
            </Toggle>
            <Toggle size="md" defaultChecked={false}>
              roast mode
            </Toggle>
          </div>
        </section>

        {/* Badge */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Badge</h2>
          <div className="flex flex-wrap items-center gap-6">
            <Badge variant="critical">
              <BadgeDot className="bg-accent-red" />
              critical
            </Badge>
            <Badge variant="warning">
              <BadgeDot className="bg-accent-amber" />
              warning
            </Badge>
            <Badge variant="good">
              <BadgeDot className="bg-accent-green" />
              good
            </Badge>
            <Badge variant="verdict">
              <BadgeDot className="bg-accent-red" />
              needs_serious_help
            </Badge>
          </div>
        </section>

        {/* Card */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Card</h2>
          <Card className="w-full max-w-md">
            <CardHeader>
              <Badge variant="critical">
                <BadgeDot className="bg-accent-red" />
                critical
              </Badge>
            </CardHeader>
            <CardTitle>using var instead of const/let</CardTitle>
            <CardDescription>
              the var keyword is function-scoped rather than block-scoped, which can lead to
              unexpected behavior and bugs. modern javascript uses const for immutable bindings and
              let for mutable ones.
            </CardDescription>
          </Card>
        </section>

        {/* CodeBlock */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-foreground">CodeBlock</h2>
          <CodeBlock code={sampleCode} lang="javascript" showLineNumbers />
        </section>

        {/* DiffLine */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-foreground">DiffLine</h2>
          <div className="flex flex-col gap-1 w-full max-w-md">
            <DiffLine type="removed" prefix="-" content="var total = 0;" />
            <DiffLine type="added" prefix="+" content="const total = 0;" />
            <DiffLine
              type="context"
              prefix=" "
              content="for (let i = 0; i &lt; items.length; i++) {"
            />
          </div>
        </section>

        {/* Table */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Table</h2>
          <Card className="w-full max-w-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-primary">1</TableCell>
                  <TableCell>@devmaster</TableCell>
                  <TableCell>9847</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-primary">2</TableCell>
                  <TableCell>@codeNinja</TableCell>
                  <TableCell>8234</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* CodeEditor */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-foreground">CodeEditor</h2>
          <Card className="w-full max-w-lg">
            <CodeEditor value={code} onChange={setCode} placeholder="// Paste your code here..." />
          </Card>
        </section>
      </div>
    </main>
  );
}
