export interface CCRConfig {
  language: "en" | "zh" | "jp";
  claudeApiKey?: string;
  outputDir?: string;
}

export interface GitDiffOptions {
  sourceBranch: string;
  targetBranch: string;
  outputFile: string;
}

export interface CLIOptions {
  sourceBranch?: string;
  targetBranch?: string;
  output?: string;
  language?: string;
  detail?: boolean;
}
