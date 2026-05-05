import { exec } from "child_process";
import fs from "fs";
import path from "path";

export async function openInBrowser(filePath = "") {
  return new Promise((resolve) => {
    if (typeof filePath === "object") {
        filePath = filePath.path || filePath.filePath || Object.values(filePath)[0] || "";
    }

    const resPath = path.resolve(filePath);

    if (!fs.existsSync(resPath)) {
      return resolve(
        `Cannot open file: file not found at ${resPath}. Make sure the file was created first.`
      );
    }

    const platform = process.platform;
    let cmd;

    if (platform === "win32") {
      cmd = `start "" "${resPath}"`;
    } else if (platform === "linux") {
      cmd = `xdg-open "${resPath}"`;
    } else if (platform === "darwin") {
      cmd = `open "${resPath}"`;
    } else {
      return resolve(`Unsupported platform ${platform}. Please open the file manually: ${resPath}`);
    }

    exec(cmd, (err) => {
      if (err) {
        return resolve(`Failed to open browser: ${err.message}\nTry opening manually: ${resPath}`);
      }
      resolve(`Opened in Browser: ${resPath}`);
    });
  });
}