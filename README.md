TODOs:

- Publish to npm
- Craft code review prompt v1
- Create Roadmap
- Test in my project
– Refine README.md
– Refine gitignore
– Refine Testing


# CCR - Claude Code Review

A TypeScript CLI tool for generating code review summaries using Claude AI.

## Features

- 🚀 Initialize project configuration with language selection
- 🔍 Generate comprehensive code reviews between git branches
- 🌐 Multi-language support (English, Chinese, Japanese)
- 📊 Detailed diff analysis and suggestions
- 📝 Markdown output format
- 🎯 Loading status indicators

## Installation

```bash
npm install -g ccr
```

## Usage

### Initialize Configuration

```bash
npx ccr init
```

Options:
- `-l, --language <language>` - Output language (en/zh/jp), default: en

### Generate Code Review

```bash
npx ccr <source-branch> <target-branch>
```

Options:
- `-o, --output <file>` - Output file path, default: code-review.md
- `-l, --language <language>` - Output language (en/zh/jp)

### Examples

```bash
# Initialize with English output
npx ccr init

# Initialize with Chinese output
npx ccr init -l zh

# Generate review comparing feature branch to main
npx ccr feature/user-auth main

# Generate review with custom output file
npx ccr feature/payment main -o payment-review.md

# Generate review in Chinese
npx ccr feature/ui-update main -l zh
```

## Configuration

### Environment Variables

Set your Claude API key:

```bash
export CLAUDE_API_KEY=your_api_key_here
# or
export ANTHROPIC_API_KEY=your_api_key_here
```

### Configuration File

After running `ccr init`, a `.ccr.json` configuration file will be created:

```json
{
  "language": "en",
  "outputDir": "./reviews"
}
```

## Workflow

1. **Initialization**: Run `ccr init` to set up configuration
2. **Branch Fetching**: Automatically fetches specified branches from origin
3. **Diff Generation**: Creates git diff between target and source branches
4. **AI Analysis**: Sends diff to Claude AI for comprehensive review
5. **Report Generation**: Outputs markdown file with review summary

## Output Format

The generated review includes:

- **Summary**: Brief overview of changes
- **Detailed Analysis**: In-depth code review
- **Suggestions**: Improvement recommendations
- **Metadata**: Timestamp, branches, language info

## Requirements

- Node.js 14+
- Git repository
- Claude API key (from Anthropic)
- Internet connection for API calls

## Development

```bash
# Install dependencies
npm install

# Build project
npm run build

# Run in development mode
npm run dev

# Run tests
npm test
```

## Project Structure

```
src/
├── commands/           # CLI command implementations
│   ├── init.ts        # Initialize configuration
│   └── review.ts      # Generate code review
├── utils/             # Utility functions
│   ├── config.ts      # Configuration management
│   ├── git.ts         # Git operations
│   └── claude.ts      # Claude API integration
├── types/             # TypeScript type definitions
│   └── index.ts
└── index.ts           # Main CLI entry point
```

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues and questions, please create an issue in the repository.