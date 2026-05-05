import "dotenv/config"
import { OpenAI } from "openai";
import { tool_map } from "./tools/index.js";
import { SYSTEM_PROMPT } from "./prompts/system_prompts.js";

const client = new OpenAI({
  apiKey: process.env.OpenAI_API_KEY,
});

async function executeTool(tool_name, tool_args) {
  const tool = tool_map[tool_name];
  if (!tool) return `Unknown Tool: ${tool_name}`;

  let parsedArgs = tool_args;
  if (typeof tool_args === "string" && (tool_args.startsWith("{") || tool_args.startsWith("["))) {
    try { parsedArgs = JSON.parse(tool_args); } catch (e) {}
  }

  if (tool_name === "createFile") {
    const filePath = parsedArgs.path || parsedArgs.filePath;
    return await tool(filePath, parsedArgs.content);
  }

  if (tool_name === "openInBrowser") {
    const targetPath = typeof parsedArgs === "object" ? (parsedArgs.path || parsedArgs.filePath || Object.values(parsedArgs)[0]) : parsedArgs;
    return await tool(targetPath);
  }

  const finalArg = typeof parsedArgs === "object" ? Object.values(parsedArgs)[0] : parsedArgs;
  return await tool(finalArg);
}

function parseResponse(raw) {
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { 
        step: "THINK", 
        content: "SYSTEM WARNING: My previous output was invalid JSON (perhaps I output two objects at once or forgot to escape quotes). I must output exactly ONE valid JSON object." 
    };
  }
}

export async function runAgent(inputMessage) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: inputMessage },
  ];

  console.log("\n\x1b[90m⚙️  Agent initialized. Thinking...\x1b[0m\n");

  let fileCreated = false;
  let thinkCount = 0;

  while (true) {
    const response = await client.chat.completions.create({
      model: "gpt-5.5",
      messages,
    });

    const content = response.choices[0].message.content;
    const parsed = parseResponse(content);

    messages.push({ role: "assistant", content: JSON.stringify(parsed) });

    if (parsed.step === "START") {
      thinkCount = 0;
      console.log(`\x1b[34m[START]\x1b[0m ${parsed.content}`); 
    }

    else if (parsed.step === "THINK") {
      thinkCount++;
      console.log(`\x1b[33m[THINK]\x1b[0m ${parsed.content}`); 

      if (thinkCount >= 3) {
        messages.push({
          role: "user",
          content: "Stop thinking. You MUST now call createFile tool with the COMPLETE index.html content. Do not summarize."
        });
        thinkCount = 0;
      }
    }

    else if (parsed.step === "TOOL") {
      if (parsed.tool_name === "createFile") fileCreated = true;
      thinkCount = 0;
      
      console.log(`\x1b[36m[TOOL]\x1b[0m  🛠️  Calling \x1b[1m${parsed.tool_name}\x1b[0m`); 

      let displayArgs = parsed.tool_args;
      if (parsed.tool_name === "createFile") {
          displayArgs = "[HTML Code Hidden for UI Cleanliness]";
      } else if (typeof displayArgs === "object") {
          displayArgs = JSON.stringify(displayArgs);
      }
      console.log(`\x1b[90m        ↳ args: ${displayArgs}\x1b[0m`); 

      const result = await executeTool(parsed.tool_name, parsed.tool_args);
      
      let displayResult = result;
      if (typeof result === "string" && result.length > 150) {
          displayResult = result.substring(0, 150) + "... [Truncated]";
      }
      console.log(`\x1b[32m[OBSERVE]\x1b[0m ${displayResult}\n`); 

      messages.push({
        role: "user",
        content: result, 
      });
    }

    else if (parsed.step === "OUTPUT") {
      if (!fileCreated) {
        messages.push({
          role: "user",
          content: "You have NOT called createFile yet. index.html does not exist on disk. Your NEXT step MUST be TOOL with tool_name createFile."
        });
        continue;
      }
      console.log(`\x1b[32m\x1b[1m[OUTPUT] 🎉 ${parsed.content}\x1b[0m\n`); 
      break;
    }
  }
}