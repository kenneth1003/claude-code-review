import { exec } from "child_process";
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

      // const { stdout, stderr } = await execAsync(command, {
      //   cwd: diffFilePath.split("/").slice(0, -2).join("/"),
      // });
      // if (stderr) {
      //   console.error("Claude CLI stderr:", stderr);
      // }

      // const reviewText = stdout.trim();

      console.log();
      console.log(
        chalk.cyan(
          "👇🏻 Please Copy the following command and execute it in your terminal"
        )
      );
      console.log();
      console.log(command);
      console.log();
    } catch (error) {
      throw new Error(
        `Failed to generate code review: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
