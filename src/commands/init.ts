import chalk from "chalk";
import { promises as fs } from "fs";
import { join } from "path";
import inquirer from "inquirer";
import { CCRConfig } from "../types";
import { saveConfig } from "../utils/config";
import { promptReview } from "../prompts/review";
import { promptReviewDetail } from "../prompts/review-detailed";

export async function initCommand(options: {
  language?: string;
  remote?: string;
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
      name: "remote",
      message: "Enter remote name:",
      default: options.remote || "origin",
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

  // Check if output directory already exists
  const outputDirPath = join(process.cwd(), answers.outputDir);
  let dirExists = false;
  try {
    const stats = await fs.stat(outputDirPath);
    dirExists = stats.isDirectory();
  } catch {
    // Directory doesn't exist, which is fine
  }

  if (dirExists) {
    console.log(
      chalk.yellow(`⚠️  Directory '${answers.outputDir}' already exists!`)
    );
    const { continueAnyway } = await inquirer.prompt([
      {
        type: "confirm",
        name: "continueAnyway",
        message: "Continue with initialization anyway?",
        default: true,
      },
    ]);

    if (!continueAnyway) {
      console.log(chalk.red("❌ Initialization cancelled."));
      process.exit(0);
    }
  }

  // Ask about adding to gitignore
  const { addToGitignore } = await inquirer.prompt([
    {
      type: "confirm",
      name: "addToGitignore",
      message: `Add '${answers.outputDir}' to .gitignore?`,
      default: true,
    },
  ]);

  const config: CCRConfig = {
    language: answers.language,
    outputDir: answers.outputDir,
    remote: answers.remote,
  };

  try {
    // Save configuration
    await saveConfig(config);
    console.log(chalk.green("✅ Configuration saved to .ccr.json"));

    // Create output directory if it doesn't exist
    if (!dirExists) {
      await fs.mkdir(outputDirPath, { recursive: true });
      console.log(
        chalk.green(`✅ Output directory created: ${config.outputDir}`)
      );
    } else {
      console.log(
        chalk.blue(`ℹ️  Using existing directory: ${config.outputDir}`)
      );
    }

    // Add to gitignore if requested
    if (addToGitignore) {
      try {
        const gitignorePath = join(process.cwd(), ".gitignore");
        let gitignoreContent = "";

        // Read existing .gitignore if it exists
        try {
          gitignoreContent = await fs.readFile(gitignorePath, "utf-8");
        } catch {
          // .gitignore doesn't exist, will create new one
        }

        // Check if the output directory is already in .gitignore
        const outputDirPattern = answers.outputDir.replace(/^\.\//, "");
        const patterns = gitignoreContent
          .split("\n")
          .map((line) => line.trim());
        const alreadyIgnored = patterns.some(
          (pattern) =>
            pattern === outputDirPattern ||
            pattern === `${outputDirPattern}/` ||
            pattern === answers.outputDir ||
            pattern === `${answers.outputDir}/`
        );

        if (!alreadyIgnored) {
          const newEntry =
            gitignoreContent.endsWith("\n") || gitignoreContent === ""
              ? `${outputDirPattern}/\n`
              : `\n${outputDirPattern}/\n`;
          await fs.writeFile(gitignorePath, gitignoreContent + newEntry);
          console.log(
            chalk.green(`✅ Added '${outputDirPattern}/' to .gitignore`)
          );
        } else {
          console.log(
            chalk.blue(`ℹ️  '${outputDirPattern}' already in .gitignore`)
          );
        }
      } catch (error) {
        console.warn(chalk.yellow(`⚠️  Could not update .gitignore: ${error}`));
      }
    }

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

    // Check if command files already exist and prompt for confirmation
    const existingFiles = [];
    try {
      await fs.access(claudeCommandPath);
      existingFiles.push("ccr-review.md");
    } catch {
      // File doesn't exist
    }

    try {
      await fs.access(claudeCommandDetailPath);
      existingFiles.push("ccr-review-detail.md");
    } catch {
      // File doesn't exist
    }

    if (existingFiles.length > 0) {
      console.log(
        chalk.yellow(
          `⚠️  The following Claude command files already exist: ${existingFiles.join(
            ", "
          )}`
        )
      );
      const { overwriteCommands } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwriteCommands",
          message: "Do you want to overwrite the existing command files?",
          default: false,
        },
      ]);

      if (!overwriteCommands) {
        console.log(chalk.blue("ℹ️  Skipping Claude command file creation."));
      } else {
        // Write the command files
        await fs.writeFile(claudeCommandPath, claudeCommand);
        await fs.writeFile(claudeCommandDetailPath, claudeCommandDetail);
        console.log(
          chalk.green("✅ Claude command files overwritten: .claude/commands/")
        );
      }
    } else {
      // Write the command files
      await fs.writeFile(claudeCommandPath, claudeCommand);
      await fs.writeFile(claudeCommandDetailPath, claudeCommandDetail);
      console.log(chalk.green("✅ Claude command created: .claude/commands/"));
    }

    console.log(chalk.green("\n🎉 CCR initialization complete!"));
    console.log(chalk.cyan("\nNext steps:"));
    console.log(
      chalk.cyan("Run: npx ccr review <source-branch> <target-branch>")
    );
  } catch (error) {
    console.error(chalk.red("❌ Failed to initialize CCR:"), error);
    process.exit(1);
  }
}
