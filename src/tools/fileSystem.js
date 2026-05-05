import fs from "fs";
import path from "path";
import { exitCode } from "process";

export async function createFolder(folderPath = "") {
  try {
    const resPath = path.resolve(folderPath);
    fs.mkdirSync(resPath, { recursive: true });
    return `Folder created: ${resPath}`;
  } catch (error) {
    return `Failed to create folder ${folderPath} : ${error.message}`;
  }
}

export async function createFile(filePath = "", content = "") {
  try {
    const resPath = path.resolve(filePath);
    fs.mkdirSync(path.dirname(resPath), { recursive: true });
    fs.writeFileSync(resPath, content, "utf-8");
    return `File Create: ${resPath}`;
  } catch (error) {
    return `Failed to create file ${filePath} : ${error.message}`;
  }
}

export async function readFile(filePath = "") {
    try{
        const resPath = path.resolve(filePath);
        const content = fs.readFileSync(resPath , "utf-8")
        return `Content of ${resPath}:\n\n${content}`
    }
    catch (error) {
    return `Failed to read file ${filePath} : ${error.message}`;
  }
    
}

export async function listDirectory(dirPath = "") {
    try{
        const resPath = path.resolve(dirPath);
        const list = fs.readdirSync(resPath , {withFileTypes: true})

        if(list.length === 0){
            return `${resPath} is empty.`
        }

        const listting = list.map((l) => (l.isDirectory() ? `Folder ${l.name}` : `File ${l.name}`)).join("\n");

        return `Contents of ${resolved}:\n${listing}`;
    }
    catch (error) {
    return `Failed to list directory ${dirPathPath} : ${error.message}`;
  }
    
}