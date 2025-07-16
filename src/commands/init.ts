import chalk from "chalk";
import { promises as fs } from "fs";
import { join } from "path";
import { CCRConfig } from "../types";
import { saveConfig, getClaudeApiKey } from "../utils/config";

export async function initCommand(options: {
  language?: string;
}): Promise<void> {
  console.log(chalk.blue("🚀 Initializing CCR configuration..."));

  const language = options.language || "en";

  if (!["en", "zh", "jp"].includes(language)) {
    console.error(
      chalk.red("❌ Invalid language. Supported languages: en, zh, jp")
    );
    process.exit(1);
  }

  const config: CCRConfig = {
    language: language as "en" | "zh" | "jp",
    outputDir: "./reviews",
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

    const claudeCommand = `Please review the given code`;
    const claudeCommandDetail = `Please review the given code detail`;

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
