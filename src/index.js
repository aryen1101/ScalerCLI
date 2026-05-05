import "dotenv/config";
import readline from "readline";
import { runAgent } from "./agent.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (q) => new Promise((res) => rl.question(q, res));

console.log("╔══════════════════════════════════════╗");
console.log("║   🤖  Scaler Clone — AI Agent CLI    ║");
console.log("║   Type exit to quit                  ║");
console.log("╚══════════════════════════════════════╝\n");

while (true) {
  const input = (await prompt("You: ")).trim();

  if (!input) continue;

  if (input === "exit" || input === "quit") {
    console.log("Bye!");
    rl.close();
    process.exit(0);
  }

  await runAgent(input);
}