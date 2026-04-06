import { Groq } from "groq-sdk";
import { roastModeEnum, severityEnum, submissionLanguageEnum, verdictEnum } from "@/db/schema";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export type RoastResponse = {
  score: number;
  verdict: (typeof verdictEnum.enumValues)[number];
  severity: (typeof severityEnum.enumValues)[number];
  feedback: string;
  findings: Array<{
    severity: (typeof severityEnum.enumValues)[number];
    line: number | null;
    message: string;
    suggestion: string | null;
  }>;
  diff: {
    from: string;
    to: string;
    lines: Array<{
      type: "added" | "removed" | "context";
      content: string;
    }>;
  };
};

function buildPrompt(
  code: string,
  language: (typeof submissionLanguageEnum.enumValues)[number],
  roastMode: (typeof roastModeEnum.enumValues)[number]
): string {
  const isRoastMode = roastMode === "roast";
  const tone = isRoastMode
    ? "sarcastic, harsh, and humorous"
    : "constructive, encouraging, and helpful";

  return `You are an expert code reviewer${isRoastMode ? " who roasts bad code" : ""}. 

Analyze the following ${language} code and provide a structured review.

TONE: ${tone}

CODE:
\`\`\`${language}
${code}
\`\`\`

IMPORTANT: You MUST provide a "diff" section showing suggested code improvements. This is required.

Respond with ONLY valid JSON (no other text), in this exact format:
{
  "score": number (0-10, where 0 is terrible and 10 is perfect),
  "verdict": "good" | "warning" | "error",
  "severity": "info" | "warning" | "error" | "critical",
  "feedback": string (a ${isRoastMode ? "sarcastic roast" : "constructive feedback"} about the code),
  "findings": [
    {
      "severity": "info" | "warning" | "error" | "critical",
      "line": number or null,
      "message": string (the issue found),
      "suggestion": string or null (how to fix it)
    }
  ],
  "diff": {
    "from": "original file name",
    "to": "improved file name", 
    "lines": [
      {
        "type": "context" | "removed" | "added",
        "content": "code line"
      }
    ]
  }
}

The "diff" section should show the improved version of the code with:
- "context" lines for unchanged code
- "removed" lines for code that should be deleted (prefixed with -)
- "added" lines for new code that should be added (prefixed with +)

Be strict with scoring - most code should get 5-7, truly terrible code gets 0-2, excellent code gets 8-10.`;
}

export async function analyzeCode(
  code: string,
  language: (typeof submissionLanguageEnum.enumValues)[number] = "typescript",
  roastMode: (typeof roastModeEnum.enumValues)[number] = "honest"
): Promise<RoastResponse> {
  const prompt = buildPrompt(code, language, roastMode);

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.7,
    response_format: {
      type: "json_object",
    },
  });

  const responseText = completion.choices[0]?.message?.content;

  if (!responseText) {
    throw new Error("No response from Groq API");
  }

  const parsed = JSON.parse(responseText) as RoastResponse;

  return parsed;
}
