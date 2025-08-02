#!/usr/bin/env node

import { Command } from "commander";
import { initCommand } from "./commands/init";
import { reviewCommand } from "./commands/review";
const packageJson = require("../package.json");
const version = packageJson.version;

const program = new Command();

program
  .name("ccr")
  .description("CLI tool for generating code review summaries using Claude AI")
  .version(version);

program
  .command("init")
  .description("Initialize CCR configuration")
  .option(
    "-l, --language <language>",
    "Output language ex: (English, 繁體中文)",
    "English"
  )
  .action(initCommand);

program
  .command("review")
  .alias("r")
  .description("Generate code review summary between two branches")
  .argument("<source-branch>", "Source branch for comparison")
  .argument("<target-branch>", "Target branch for comparison")
  .option("-o, --output <file>", "Output file path", "code-review.md")
  .option("-l, --language <language>", "Output language ex:(English, 繁體中文)")
  .option("-d, --detail", "Generate detailed code review")
  .action(reviewCommand);

program.parse();

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
