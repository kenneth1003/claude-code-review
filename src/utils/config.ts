import { promises as fs } from "fs";
import { join } from "path";
import { CCRConfig } from "../types";

const CONFIG_FILE = ".ccr.json";

export async function loadConfig(): Promise<CCRConfig | null> {
  try {
    const configPath = join(process.cwd(), CONFIG_FILE);
    const configData = await fs.readFile(configPath, "utf-8");
    return JSON.parse(configData) as CCRConfig;
  } catch (error) {
    return null;
  }
}

export async function saveConfig(config: CCRConfig): Promise<void> {
  const configPath = join(process.cwd(), CONFIG_FILE);
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
}
