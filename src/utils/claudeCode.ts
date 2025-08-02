import { spawn } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

export class ClaudeCodeService {
  constructor() {}

  async generateCodeReview(
    diffFilePath: string,
    isDetail: boolean = false
  ): Promise<void> {
    try {
      const commandName = isDetail ? "ccr-review-detail" : "ccr-review";
      const commandFile = join(
        process.cwd(),
        ".claude",
        "commands",
        `${commandName}.md`
      );

      // Check if command file exists
      if (!existsSync(commandFile)) {
        throw new Error(
          `Command file not found: ${commandFile}\n` +
            `Please ensure the ${commandName}.md file exists in <project-root>/.claude/commands/`
        );
      }

      const command = `claude -p "/${commandName} ${diffFilePath}"`;

      await new Promise<void>((resolve, reject) => {
        const child = spawn(command, {
          stdio: ["inherit", "pipe", "pipe"],
          cwd: process.cwd(),
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
