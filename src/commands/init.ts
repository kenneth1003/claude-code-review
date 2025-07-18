import chalk from "chalk";
import { promises as fs } from "fs";
import { join } from "path";
import inquirer from "inquirer";
import { CCRConfig } from "../types";
import { saveConfig, getClaudeApiKey } from "../utils/config";
import { promptReview } from "./prompt-review";
import { promptReviewDetail } from "./prompt-review-detail";

export async function initCommand(options: {
  language?: string;
}): Promise<void> {
  console.log(chalk.blue("🚀 Initializing CCR configuration..."));

  // Prompt for configuration options
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "language",
      message: "Enter output language:",
      default: options.language || "en",
    },
    {
      type: "input",
      name: "outputDir",
      message: "Enter output directory path:",
      default: "./reviews",
      validate: (input) => {
        if (!input.trim()) {
          return "Output directory cannot be empty";
        }
        return true;
      },
    },
  ]);

  const config: CCRConfig = {
    language: answers.language,
    outputDir: answers.outputDir,
  };

  try {
    // Save configuration
    await saveConfig(config);
    console.log(chalk.green("✅ Configuration saved to .ccr.json"));

    // Create output directory
    const outputDir = join(process.cwd(), config.outputDir || "./reviews");
    await fs.mkdir(outputDir, { recursive: true });
    console.log(
      chalk.green(`✅ Output directory created: ${config.outputDir}`)
    );

    // Add Claude code command as mentioned in spec
    const claudeCommandsDir = join(process.cwd(), ".claude/commands");
    const claudeCommandPath = join(claudeCommandsDir, "ccr-review.md");
    const claudeCommandDetailPath = join(
      claudeCommandsDir,
      "ccr-review-detail.md"
    );

    const claudeCommand = promptReview;
    const claudeCommandDetail = promptReviewDetail;

    // Create the .claude/commands directory
    await fs.mkdir(claudeCommandsDir, { recursive: true });

    // Write the command files
    await fs.writeFile(claudeCommandPath, claudeCommand);
    await fs.writeFile(claudeCommandDetailPath, claudeCommandDetail);
    console.log(chalk.green("✅ Claude command created: .claude/commands/"));

    console.log(chalk.green("\n🎉 CCR initialization complete!"));
    console.log(chalk.cyan("\nNext steps:"));
    console.log(chalk.cyan("Run: ccr <source-branch> <target-branch>"));
  } catch (error) {
    console.error(chalk.red("❌ Failed to initialize CCR:"), error);
    process.exit(1);
  }
}
