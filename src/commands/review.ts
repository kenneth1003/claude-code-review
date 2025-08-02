import chalk from "chalk";
import ora from "ora";
import { promises as fs } from "fs";
import { join } from "path";
import { loadConfig } from "../utils/config";
import { fetchBranches, generateDiff, branchExists } from "../utils/git";
import { ClaudeCodeService } from "../utils/claudeCode";
import { CLIOptions } from "../types";
import { generateDiffFilename } from "../utils/filename";

const DEFAULT_REMOTE = "origin";

export async function reviewCommand(
  sourceBranch: string,
  targetBranch: string,
  options: CLIOptions
): Promise<void> {
  console.log(
    chalk.blue(`🔍 Generating code review: ${sourceBranch} → ${targetBranch}`)
  );

  // Load configuration
  const config = await loadConfig();
  const outputDir = config?.outputDir || "./reviews";

  let spinner = ora("Validating branches...").start();

  try {
    // Check if branches exist
    const [sourceExists, targetExists] = await Promise.all([
      branchExists(config?.remote || DEFAULT_REMOTE, sourceBranch),
      branchExists(config?.remote || DEFAULT_REMOTE, targetBranch),
    ]);

    if (!sourceExists) {
      spinner.fail(`Source branch '${sourceBranch}' not found`);
      process.exit(1);
    }

    if (!targetExists) {
      spinner.fail(`Target branch '${targetBranch}' not found`);
      process.exit(1);
    }

    spinner.succeed("Branches validated");

    // Fetch branches
    spinner = ora("Fetching branches from remote...").start();
    await fetchBranches(
      sourceBranch,
      targetBranch,
      config?.remote || DEFAULT_REMOTE
    );
    spinner.succeed("Branches fetched successfully");

    // Generate diff
    spinner = ora("Generating diff...").start();

    const diffFile = generateDiffFilename(sourceBranch, targetBranch);
    const diffPath = join(outputDir, diffFile);

    // Ensure output directory exists
    await fs.mkdir(join(process.cwd(), outputDir), { recursive: true });

    const diff = await generateDiff({
      sourceBranch,
      targetBranch,
      outputFile: diffPath,
      remote: config?.remote || DEFAULT_REMOTE,
    });

    if (!diff.trim()) {
      spinner.warn("No differences found between branches");
      return;
    }

    spinner.succeed(`Diff generated: ${diffFile}`);

    // Generate code review with Claude
    spinner = ora(
      "Analyzing code with Claude Code...(it may take a while)"
    ).start();
    const claudeService = new ClaudeCodeService();
    await claudeService.generateCodeReview(diffPath, options.detail || false);
    spinner.succeed("Code review generated");

    // Clean up diff file
    await fs.unlink(diffPath);

    console.log(chalk.green("\n✨ Code review completed successfully!"));
    console.log(chalk.cyan(`📄 Review summary saved in: ${outputDir}`));
  } catch (error) {
    spinner.fail("Failed to generate code review");
    console.error(chalk.red("Error details:"), error);
    process.exit(1);
  }
}
