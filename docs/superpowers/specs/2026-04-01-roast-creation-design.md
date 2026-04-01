# Roast Creation Feature - Design

**Date:** 2026-04-01
**Feature:** Code submission and AI-powered analysis

## Overview

Allow users to paste code, receive AI analysis (honest or roast mode), and view detailed results with score, issues, and suggested fixes.

## Requirements

1. Roast mode toggle (honest/roast)
2. No share functionality for now
3. Use Groq for free LLM inference
4. Store results in database
5. Redirect to `/results/[id]` after submission

## Architecture

### Data Flow

1. **Frontend → API**: `{ code, language, roastMode }`
2. **API → Groq**: Structured prompt requesting JSON response
3. **API → Database**: Insert submission, roast, roast_findings
4. **API → Frontend**: `{ submissionId }`
5. **Frontend**: Redirect to `/results/{submissionId}`

### API Response Schema (Groq → Backend)

```json
{
  "score": 3.5,
  "verdict": "error",
  "severity": "critical",
  "feedback": "\"this code looks like it was written during a power outage... in 2005.\"",
  "findings": [
    { "severity": "error", "line": 1, "message": "Using 'var' instead of 'const'", "suggestion": "Use const for values that won't change" }
  ],
  "diff": {
    "from": "your_code.js",
    "to": "improved_code.js",
    "lines": [
      { "type": "context", "content": "..." },
      { "type": "removed", "content": "..." },
      { "type": "added", "content": "..." }
    ]
  }
}
```

### Database Schema (already exists)

- `submissions`: id, code, language, roastMode, createdAt
- `roasts`: id, submissionId, verdict, severity, score, feedback, createdAt
- `roast_findings`: id, roastId, severity, line, message, suggestion

## Components

### To Create

| Component | Description |
|-----------|-------------|
| `src/lib/groq.ts` | Groq client + prompt builder |
| `src/app/api/roast/route.ts` | API route handler |
| `src/trpc/routers/roast.ts` | tRPC router with mutation |
| `src/components/roast-skeleton.tsx` | Loading skeleton |

### To Modify

| Component | Changes |
|-----------|---------|
| `src/app/home-client.tsx` | Add mutation + redirect |
| `src/app/results/[id]/page.tsx` | Fetch from DB instead of mock |

## Error Handling

- **API Timeout (30s)**: Auto-retry + friendly message
- **API Error**: Display error, allow retry
- **Validation**: Check empty code before submit

## External Config

- **Groq API**: Requires `GROQ_API_KEY` environment variable

## Acceptance Criteria

1. User pastes code → clicks "roast_my_code"
2. Loading state shown during analysis
3. Code and analysis stored in database
4. User redirected to `/results/{id}`
5. Results page shows score, issues, diff
6. Roast mode toggle changes analysis tone
