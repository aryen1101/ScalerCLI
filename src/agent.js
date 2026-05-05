import { OpenAI } from "openai";
import { tool_map } from "./tools/index.js";
import { SYSTEM_PROMPT } from "./prompts/system_prompts.js";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function executeTool(tool_name, tool_args) {
  const tool = tool_map[tool_name];
  if (!tool) return `Unknown Tool: ${tool_name}`;

  if (tool_name === "createFile") {
    const parsed = typeof tool_args === "string" ? JSON.parse(tool_args) : tool_args;
    return await tool(parsed.path, parsed.content);
  }

  return await tool(tool_args);
}

function parseResponse(raw) {
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { step: "OUTPUT", content: raw };
  }
}

export async function runAgent(inputMessage) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: inputMessage },
  ];

  console.log("\n AGENT STARTED...\n");

  let fileCreated = false;
  let thinkCount = 0;

  while (true) {
    const response = await client.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages,
    });

    const content = response.choices[0].message.content;
    const parsed = parseResponse(content);

    messages.push({ role: "assistant", content: JSON.stringify(parsed) });

    if (parsed.step === "START") {
      thinkCount = 0;
      console.log(`START: ${parsed.content}`);
    }

    else if (parsed.step === "THINK") {
      thinkCount++;
      console.log(`THINK: ${parsed.content}`);

      if (thinkCount >= 3) {
        messages.push({
          role: "user",
          content: JSON.stringify({
            step: "OBSERVE",
            content: "Stop thinking. You MUST now call createFile tool with the COMPLETE index.html content including all HTML, CSS and JS. Do not summarize — write the full code."
          }),
        });
        thinkCount = 0;
      }
    }

    else if (parsed.step === "TOOL") {
      if (parsed.tool_name === "createFile") fileCreated = true;
      thinkCount = 0;
      console.log(`\n TOOL: ${parsed.tool_name}`);
      console.log(`   args: ${parsed.tool_args}`);

      const result = await executeTool(parsed.tool_name, parsed.tool_args);
      console.log(`OBSERVE: ${result}\n`);

      messages.push({
        role: "user",
        content: JSON.stringify({ step: "OBSERVE", content: result }),
      });
    }

    else if (parsed.step === "OUTPUT") {
      if (!fileCreated) {
        messages.push({
          role: "user",
          content: JSON.stringify({
            step: "OBSERVE",
            content: "You have NOT called createFile yet. index.html does not exist on disk. Your NEXT step MUST be TOOL with tool_name createFile. Write the full HTML now."
          }),
        });
        continue;
      }
      console.log(`\n OUTPUT: ${parsed.content}\n`);
      break;
    }
  }
}