# 🤖 AI Web Architect CLI — Assignment 02

A conversational CLI agent that clones websites using a ReAct (Reason + Act) loop powered by Gemini LLM.

## What It Does

Takes a natural language prompt, visits a live website, and generates a working HTML/CSS/JS clone — all from the terminal.

## Project Structure

```
src/
├── index.js                # CLI entry point
├── agent.js                # ReAct loop + LLM integration
├── prompts/
│   └── system_prompts.js   # System prompt + tool descriptions
└── tools/
    ├── index.js            # Tool registry
    ├── fileSystem.js       # createFolder, createFile, readFile, listDirectory
    ├── browser.js          # openInBrowser (cross-platform)
    └── web.js              # fetchWebpage (scrapes live sites)
```

## Setup

1. Install dependencies:
   ```bash
   npm install openai axios dotenv
   ```

2. Create a `.env` file:
   ```
   GEMINI_API_KEY=your_key_here
   ```

3. Run:
   ```bash
   node src/index.js
   ```

## Example Prompt

```
Clone the Scaler Academy homepage. Fetch https://www.scaler.com/academy/, 
build a page with a sticky navbar, hero section, and footer, then open it in my browser.
```

## How the Agent Loop Works

```
START → TOOL (fetchWebpage) → THINK → TOOL (createFolder) 
      → TOOL (createFile) → TOOL (openInBrowser) → OUTPUT
```

The agent never skips steps — it always scrapes first, then builds.

## Tools Available

| Tool | Description |
|------|-------------|
| `fetchWebpage` | Scrapes nav, headings, buttons, footer, colors from a live URL |
| `createFolder` | Creates a project directory |
| `createFile` | Writes the full HTML/CSS/JS file to disk |
| `listDirectory` | Verifies file creation |
| `openInBrowser` | Opens the output in your default browser |

## Tech Stack

- **OpenAI SDK** — used as a universal client for Gemini
- **Axios** — fetches live webpage HTML
- **Node.js fs/path** — local file system operations
- **child_process** — opens browser cross-platform