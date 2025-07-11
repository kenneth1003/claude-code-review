import chalk from 'chalk';
import { promises as fs } from 'fs';
import { join } from 'path';
import { CCRConfig } from '../types';
import { saveConfig, getClaudeApiKey } from '../utils/config';

export async function initCommand(options: { language?: string }): Promise<void> {
  console.log(chalk.blue('🚀 Initializing CCR configuration...'));

  const language = options.language || 'en';
  
  if (!['en', 'zh', 'jp'].includes(language)) {
    console.error(chalk.red('❌ Invalid language. Supported languages: en, zh, jp'));
    process.exit(1);
  }

  const config: CCRConfig = {
    language: language as 'en' | 'zh' | 'jp',
    outputDir: './reviews',
  };

  // Check for Claude API key
  const apiKey = getClaudeApiKey();
  if (!apiKey) {
    console.warn(chalk.yellow('⚠️  No Claude API key found in environment variables.'));
    console.warn(chalk.yellow('   Please set CLAUDE_API_KEY or ANTHROPIC_API_KEY environment variable.'));
  }

  try {
    // Save configuration
    await saveConfig(config);
    console.log(chalk.green('✅ Configuration saved to .ccr.json'));

    // Create output directory
    const outputDir = join(process.cwd(), config.outputDir || './reviews');
    await fs.mkdir(outputDir, { recursive: true });
    console.log(chalk.green(`✅ Output directory created: ${config.outputDir}`));

    // Add Claude code command as mentioned in spec
    const claudeCommandPath = join(process.cwd(), '.claude');
    const claudeCommand = `#!/bin/bash
# CCR Command for Claude Code
# Usage: /ccr <diff-file>

if [ "$#" -ne 1 ]; then
    echo "Usage: /ccr <diff-file>"
    exit 1
fi

DIFF_FILE="$1"

if [ ! -f "$DIFF_FILE" ]; then
    echo "Error: Diff file '$DIFF_FILE' not found"
    exit 1
fi

echo "Generating code review for: $DIFF_FILE"
echo "Please analyze this git diff and provide a comprehensive code review:"
echo ""
cat "$DIFF_FILE"
`;

    await fs.writeFile(claudeCommandPath, claudeCommand, { mode: 0o755 });
    console.log(chalk.green('✅ Claude command created: .claude'));

    console.log(chalk.green('\n🎉 CCR initialization complete!'));
    console.log(chalk.cyan('\nNext steps:'));
    console.log(chalk.cyan('1. Set your Claude API key: export CLAUDE_API_KEY=your_api_key'));
    console.log(chalk.cyan('2. Run: ccr <source-branch> <target-branch>'));
    
  } catch (error) {
    console.error(chalk.red('❌ Failed to initialize CCR:'), error);
    process.exit(1);
  }
}