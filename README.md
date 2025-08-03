# CCR - Claude Code Review

A CLI tool for code review using local Claude Code. Automatically generates code review reports by analyzing Git diffs.

## ✨ Features

- 🤖 Intelligent code review using local Claude Code
- 🔍 Automatically generates and analyzes diffs between Git branches
- 🌐 Multi-language support
- 📊 Provides concise and detailed review modes
- 📝 Generates structured Markdown reports

## 📋 Prerequisites

1. **Local Claude Code Installation**
   - Installation guide: https://docs.anthropic.com/en/docs/claude-code/setup

2. **Node.js** (v14+)
   - Installation guide: https://nodejs.org/en/download/
   - CLI runs through npx using Node.js

3. **Git Repository**
   - Project must be a Git repository
   - Network connection required to fetch remote branches
   - Works with Github, Gitlab, and other Git repositories

## 🚀 Quick Start

### 1. Initialize Project

```bash
npm install -g claude-code-review

cd <your-project-directory>
npx ccr init
```

This creates a `.ccr.json` configuration file:

```json
{
  "language": "en",
  "outputDir": "./reviews",
  "remote": "origin"
}
```

### 2. Run Code Review

```bash
# Basic usage
npx ccr review <source-branch> <target-branch>

# Example: Review feature branch against main
npx ccr review feature/user-auth main

# Specify language (overrides default)
npx ccr review feature/payment main -l en

# Use detailed review mode
npx ccr review feature/api-update main --detail
```

### 3. View Review Results

```bash
# Review reports are saved in the reviews directory
cat reviews/2025-07-24-10:00-review.md
```

## 📖 Usage Guide

### Command List

```bash
# View all available commands
npx ccr --help

# Initialize configuration
npx ccr init [options]
  -l, --language <language>  Output language (e.g., English, 繁體中文), default: English

# Run code review
npx ccr review <source> <target> [options]
  -l, --language <language>  Output language (e.g., English, 繁體中文)
  --detail                   Use detailed review mode
```

### Review Modes

1. **Standard Mode**: Provides concise issue descriptions and suggestions
2. **Detailed Mode** (--detail): Includes in-depth technical analysis, impact assessment, and implementation examples

### Output Format Example

```markdown
1. src/api/user.js
[🔴 Critical][security]: 
- Description: SQL injection vulnerability in user query on line 45
- Suggestion: Use parameterized queries or prepared statements
```

## 🔧 Advanced Configuration

### Custom Configuration

`.ccr.json` supports the following options:

```json
{
  "language": "en",          // Default output language
  "outputDir": "./reviews",  // Review report output directory
  "remote": "origin"         // Git remote name (default: origin)
}
```

## 🔄 Workflow

1. **Initialize**: Run `ccr init` to create project configuration
2. **Fetch Branches**: Automatically fetches latest versions of specified branches from remote
3. **Generate Diff**: Creates Git diff between target and source branches
4. **AI Analysis**: Performs deep code review using local Claude Code
5. **Report Generation**: Outputs structured Markdown review report

## 📊 Review Categories

- **Security**: Security vulnerabilities, authentication/authorization issues
- **Performance**: Performance bottlenecks, resource optimization
- **Bug**: Logic errors, potential issues
- **Architecture**: Design patterns, modularity issues
- **Maintainability**: Code readability, naming conventions
- **Testing**: Test coverage, test quality
- **Documentation**: Documentation completeness, comment quality

## 💬 Support & Feedback

- Bug Reports: Please create an issue in GitHub Issues
- Feature Suggestions: Pull Requests welcome

## 🔎 FAQ

1. How to modify the code review prompt?
A: In the `.claude/commands/` directory, find the `ccr-review.md` and `ccr-review-detail.md` files and modify them.