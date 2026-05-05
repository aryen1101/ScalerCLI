import { createFolder, createFile, readFile, listDirectory } from "./fileSystem.js";
import { openInBrowser } from "./browser.js";
import { fetchWebpage } from "./web.js";

export const tool_map = {
  createFolder,
  createFile,
  readFile,
  listDirectory,
  openInBrowser,
  fetchWebpage,
};

export const TOOL_DESCRIPTIONS = `
1. fetchWebpage(url: string)
   - Fetches a live webpage and returns its nav links, headings, buttons, footer
     text, and color values found on the page.
   - Use this FIRST to analyze the target website before building the clone.
   - tool_args: plain URL string e.g. "https://www.scaler.com/academy/"

2. createFolder(folderPath: string)
   - Creates a directory at the given path (including any missing parent dirs).
   - tool_args: plain string e.g. "output/scaler-clone"

3. createFile(path: string, content: string)
   - Writes content to a file. Creates parent dirs if needed.
   - tool_args: JSON string: "{ \\"path\\": \\"output/scaler-clone/index.html\\", \\"content\\": \\"<full html>\\" }"

4. listDirectory(dirPath: string)
   - Lists all files and folders inside a directory.
   - tool_args: plain string e.g. "output/scaler-clone"

5. openInBrowser(filePath: string)
   - Opens an HTML file in the system default browser.
   - Always call this AFTER createFile as the final tool step.
   - tool_args: plain string e.g. "output/scaler-clone/index.html"
`;