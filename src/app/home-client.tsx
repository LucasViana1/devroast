"use client";

import { Suspense, useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { GlobalStats } from "@/components/global-stats";
import { LanguageSelector } from "@/components/language-selector";
import { MetricsSkeleton } from "@/components/metrics-skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";

export function HomeClient() {
  const [roastMode, setRoastMode] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [detectedLanguage, setDetectedLanguage] = useState<string | undefined>();

  const handleLanguageDetect = (detected: string) => {
    setDetectedLanguage(detected);
    setLanguage(detected);
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

        <Button variant="primary" disabled={code.length > 2000}>
          <span className="text-accent-green">$</span> roast_my_code
        </Button>
      </div>

      <div className="mb-12">
        <Suspense fallback={<MetricsSkeleton />}>
          <GlobalStats />
        </Suspense>
      </div>
    </>
  );
}
