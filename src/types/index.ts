export interface CCRConfig {
  language: string;
  outputDir?: string;
  remote?: string;
}

export interface GitDiffOptions {
  sourceBranch: string;
  targetBranch: string;
  outputFile: string;
  remote: string;
}

export interface CLIOptions {
  sourceBranch?: string;
  targetBranch?: string;
  output?: string;
  language?: string;
  detail?: boolean;
}
