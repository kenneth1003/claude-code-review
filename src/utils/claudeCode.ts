import { exec, spawn } from "child_process";
import { promisify } from "util";
import { promises as fs } from "fs";
import chalk from "chalk";

const execAsync = promisify(exec);

export class ClaudeCodeService {
  constructor() {}

  async generateCodeReview(
    diffFilePath: string,
    isDetail: boolean = false
  ): Promise<void> {
    try {
      const command = isDetail
        ? `claude -p "/ccr-review-detail ${diffFilePath}"`
        : `claude -p "/ccr-review ${diffFilePath}"`;

      await new Promise<void>((resolve, reject) => {
        const child = spawn(command, {
          stdio: ["inherit", "pipe", "pipe"],
          shell: true,
        });

        child.on("close", (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Process exited with code ${code}`));
          }
        });

        child.on("error", reject);
      });
    } catch (error) {
      throw new Error(
        `Failed to generate code review: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
