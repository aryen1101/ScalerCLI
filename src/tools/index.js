import { openInBrowser } from "./browser.js";
import {
  createFolder,
  readFile,
  listDirectory,
  createFile,
} from "./fileSystem.js";

export const tool_map = {
  createFolder: createFolder,
  createFile: createFile,
  readFile: readFile,
  listDirectory: listDirectory,
  openInBrowser: openInBrowser,
};

export const TOOL_DESCRIPTION = `You have access to following tools:

1. createFolder(folderPath: string)
   - Creates a directory (and any missing parent directories) at the given path.
   - Example tool_args: "output/scaler-clone"
 
2. createFile(filePath: string, content: string)
   - Writes content to a file, creating parent directories if needed.
   - Use this to write HTML, CSS, and JS files.
   - tool_args must be a JSON string: { "path": "...", "content": "..." }
 
3. readFile(filePath: string)
   - Reads and returns the content of an existing file.
   - Useful to verify a file was written correctly.
   - Example tool_args: "output/scaler-clone/index.html"
 
4. listDirectory(dirPath: string)
   - Lists all files and folders inside a directory.
   - Example tool_args: "output/scaler-clone"
 
5. openInBrowser(filePath: string)
   - Opens an HTML file in the system's default browser.
   - Always call this as the final step after all files are created.
   - Example tool_args: "output/scaler-clone/index.html"

`;
