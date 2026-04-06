"use client";

import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { GlobalStats } from "@/components/global-stats";
import { LanguageSelector } from "@/components/language-selector";
import { MetricsSkeleton } from "@/components/metrics-skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { convertSegmentPathToStaticExportFilename } from "next/dist/shared/lib/segment-cache/segment-value-encoding";

export function HomeClient() {
  const router = useRouter();
  const [roastMode, setRoastMode] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [detectedLanguage, setDetectedLanguage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageDetect = (detected: string) => {
    setDetectedLanguage(detected);
    setLanguage(detected);
  };

  const handleSubmit = async () => {
    if (!code.trim() || code.length > 2000) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: language || "javascript",
          roastMode: roastMode ? "roast" : "honest",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to analyze code");
      }

      const data = await response.json();
      router.push(`/results/${data.submissionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-accent-red" />
              <div className="h-3 w-3 rounded-full bg-accent-amber" />
              <div className="h-3 w-3 rounded-full bg-accent-green" />
            </div>
            <LanguageSelector
              value={language}
              onChange={setLanguage}
              detectedLanguage={detectedLanguage}
            />
          </div>
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            onLanguageChange={handleLanguageDetect}
            isLimitExceeded={code.length > 2000}
            placeholder={`// Paste your code here and get roasted!
function add(a, b) {
  return a + b;
}`}
          />
        </Card>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Toggle checked={roastMode} onChange={setRoastMode}>
            roast mode
          </Toggle>
          <span className="font-secondary text-xs text-text-tertiary">
            {"// maximum sarcasm enabled"}
          </span>
        </div>

        <Button
          variant="primary"
          disabled={code.length > 2000 || !code.trim() || isLoading}
          onClick={handleSubmit}
        >
          <span className="text-accent-green">$</span>
          {isLoading ? "analyzing..." : "roast_my_code"}
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-accent-red/10 px-4 py-2 font-primary text-sm text-accent-red">
          {error}
        </div>
      )}

      <div className="mb-12">
        <Suspense fallback={<MetricsSkeleton />}>
          <GlobalStats />
        </Suspense>
      </div>
    </>
  );
}
