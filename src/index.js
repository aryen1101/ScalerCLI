import "dotenv/config";
import readline from "readline";
import { runAgent } from "./agent.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (q) => new Promise((res) => rl.question(q, res));

async function main() {
  console.clear();
  console.log("\x1b[36m╔══════════════════════════════════════╗\x1b[0m");
  console.log("\x1b[36m║   🚀  Scaler Clone — AI Agent CLI    ║\x1b[0m");
  console.log("\x1b[36m║   Type 'exit' to quit                ║\x1b[0m");
  console.log("\x1b[36m╚══════════════════════════════════════╝\x1b[0m\n");

  while (true) {
   
    const input = (await prompt("\x1b[35mYou › \x1b[0m")).trim();

    if (!input) continue;

    if (input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
      console.log("\x1b[32m Goodbye!\x1b[0m");
      rl.close();
      process.exit(0);
    }

    await runAgent(input);
  }
}

main(); 