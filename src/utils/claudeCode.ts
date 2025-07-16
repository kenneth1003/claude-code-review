import { exec } from "child_process";
import { promisify } from "util";
import { promises as fs } from "fs";

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

      console.log(command);
      const { stdout, stderr } = await execAsync(command, {
        cwd: diffFilePath.split("/").slice(0, -2).join("/"),
      });
      console.log(command);

      if (stderr) {
        console.error("Claude CLI stderr:", stderr);
      }

      const reviewText = stdout.trim();
    } catch (error) {
      throw new Error(
        `Failed to generate code review: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
