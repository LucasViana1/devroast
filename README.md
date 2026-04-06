# DevRoast

> Paste your code. Get roasted.

DevRoast is a code review platform where developers submit their code and receive brutally honest feedback from the community. Built during the NLW event by Rocketseat.

## Features

- **Submit Code** - Paste any code snippet and get it reviewed
- **Roast Mode** - Toggle between honest feedback and maximum sarcasm mode
- **Shame Leaderboard** - See the worst code on the internet, ranked by shame
- **Score System** - Get rated on a 1-10 scale with detailed analysis

## How It Works

1. Paste your code in the editor
2. Toggle roast mode for extra sarcasm (optional)
3. Submit and get your brutal review
4. Compare your score on the leaderboard

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- Shiki (syntax highlighting)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Opencode

Este projeto foi desenvolvido com auxíio do [opencode](https://opencode.ai), um assistente de IA para desenvolvimento de software.

### Adicionando MCP ao Projeto

Para integrar o opencode com este projeto, adicione o seguinte ao arquivo de configuração global em `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "nome-do-mcp-1": {
      "type": "local",
      "command": [
        "npx",
        "@escopo/mcp@latest"
      ],
      "enabled": true
    },
    "nome-do-mcp-2": {
      "type": "remote",
      "url": "https://mcp.exemplo.com/mcp"
    },
    "nome-do-mcp-3": {
      "command": [
        "/caminho/para/app-mcp",
        "--flag",
        "valor"
      ],
      "enabled": true,
      "type": "local"
    }
  }
}
```

Consulte a [documentação do opencode](https://docs.opencode.ai) para mais informações sobre MCPs disponíveis.

---

Built with 🔥 during NLW by Rocketseat
