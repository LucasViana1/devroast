"use client";

import { useState } from "react";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils";

const selectorVariants = tv({
  base: "relative inline-flex items-center gap-2",
});

export interface LanguageSelectorProps {
  value?: string;
  onChange: (language: string) => void;
  detectedLanguage?: string;
  className?: string;
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "bash", label: "Shell" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
  { value: "other", label: "Other" },
] as const;

export function LanguageSelector({
  value,
  onChange,
  detectedLanguage,
  className,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.value === value);
  const isAutoDetected = detectedLanguage && value === detectedLanguage;

  return (
    <div className={cn(selectorVariants({ className }))}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border border-border-primary bg-background-secondary px-3 py-1.5 font-primary text-xs text-text-primary transition-colors hover:border-border-secondary"
      >
        <span className="text-accent-green">{isAutoDetected ? "//" : "$"}</span>
        <span>{currentLang?.label || "Select language"}</span>
        <svg
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setIsOpen(false)}
            aria-label="Close language selector"
          />
          <div className="absolute left-0 top-full z-20 mt-1 max-h-60 w-48 overflow-y-auto rounded-md border border-border-primary bg-background-secondary shadow-lg">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => {
                  onChange(lang.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full px-3 py-2 text-left font-primary text-xs transition-colors hover:bg-background",
                  lang.value === value ? "bg-background text-accent-green" : "text-text-primary"
                )}
              >
                {lang.label}
                {lang.value === detectedLanguage && detectedLanguage !== value && (
                  <span className="ml-2 text-text-tertiary">(detected)</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
