"use client";

import flourite from "flourite";
import dynamic from "next/dynamic";
import type { TextareaHTMLAttributes } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils";

const DynamicCodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

const codeEditorVariants = tv({
  base: "min-h-[300px] w-full border-0 bg-transparent rounded-md font-primary text-sm text-text-primary resize-none focus:outline-none p-0",
});

export interface CodeEditorProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  showLineNumbers?: boolean;
  className?: string;
}

const DEBOUNCE_DELAY = 300;
const LARGE_CODE_THRESHOLD = 1000;

export function CodeEditor({
  value,
  onChange,
  language: controlledLanguage,
  onLanguageChange,
  showLineNumbers = true,
  className,
  ...props
}: CodeEditorProps) {
  const [language, setLanguage] = useState(controlledLanguage || "javascript");
  const [isClient, setIsClient] = useState(false);
  const [isManualSelection, setIsManualSelection] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastDetectedRef = useRef<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setLineCount(value.split("\n").length || 1);
  }, [value]);

  useEffect(() => {
    if (controlledLanguage && !isManualSelection) {
      setLanguage(controlledLanguage);
    }
  }, [controlledLanguage, isManualSelection]);

  const detectLanguage = useCallback(
    (code: string) => {
      if (isManualSelection) return;

      const lines = code.split("\n").length;
      const delay = lines > LARGE_CODE_THRESHOLD ? DEBOUNCE_DELAY : 0;

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        const result = flourite(code, { heuristic: true });
        const detectedLang = result.language.toLowerCase();

        const langMap: Record<string, string> = {
          js: "javascript",
          ts: "typescript",
          jsx: "javascript",
          tsx: "typescript",
          py: "python",
          rb: "ruby",
          cs: "csharp",
          "c++": "cpp",
          sh: "bash",
          shell: "bash",
          yml: "yaml",
          php: "php",
        };

        const normalizedLang = langMap[detectedLang] || detectedLang;
        lastDetectedRef.current = normalizedLang;
        setLanguage(normalizedLang);
        onLanguageChange?.(normalizedLang);
      }, delay);
    },
    [isManualSelection, onLanguageChange]
  );

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = evt.target.value;
      onChange(newValue);
      setLineCount(newValue.split("\n").length || 1);
      if (newValue.trim()) {
        detectLanguage(newValue);
      }
    },
    [onChange, detectLanguage]
  );

  const handleScroll = useCallback(() => {
    if (lineNumbersRef.current && editorRef.current) {
      const textarea = editorRef.current.querySelector("textarea");
      if (textarea) {
        lineNumbersRef.current.scrollTop = textarea.scrollTop;
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (controlledLanguage && controlledLanguage !== lastDetectedRef.current) {
      setIsManualSelection(true);
      setLanguage(controlledLanguage);
    }
  }, [controlledLanguage]);

  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  if (!isClient) {
    return (
      <div className="flex">
        {showLineNumbers && (
          <div className="flex flex-col pr-4 text-right text-text-muted font-primary text-sm select-none">
            {lineNumbers.map((num) => (
              <span key={num}>{num}</span>
            ))}
          </div>
        )}
        <textarea
          className={cn(
            codeEditorVariants({ className }),
            "flex-1 bg-background-secondary p-4 rounded-md border border-border-primary"
          )}
          value={value}
          onChange={handleChange}
          spellCheck={false}
          {...props}
        />
      </div>
    );
  }

  return (
    <div className="flex overflow-hidden rounded-md border border-border-primary bg-background-secondary">
      {showLineNumbers && (
        <div
          ref={lineNumbersRef}
          className="flex flex-col py-4 pr-3 text-right text-text-muted font-primary text-sm select-none overflow-hidden"
          style={{ minWidth: "2.5rem" }}
        >
          {lineNumbers.map((num) => (
            <span key={num} className="leading-[1.5rem]">
              {num}
            </span>
          ))}
        </div>
      )}
      <div ref={editorRef} className="flex-1" onScroll={handleScroll}>
        <DynamicCodeEditor
          value={value}
          onChange={handleChange}
          language={language}
          className={cn(codeEditorVariants({ className }), "bg-transparent !important")}
          style={{
            backgroundColor: "transparent",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "14px",
            minHeight: "300px",
          }}
          {...props}
        />
      </div>
    </div>
  );
}
