import { simpleGit } from "simple-git";
import { promises as fs } from "fs";
import { join } from "path";
import { GitDiffOptions } from "../types";

const git = simpleGit();

export async function fetchBranches(
  sourceBranch: string,
  targetBranch: string
): Promise<void> {
  await git.fetch("origin", sourceBranch);
  await git.fetch("origin", targetBranch);
}

export async function generateDiff(options: GitDiffOptions): Promise<string> {
  const { sourceBranch, targetBranch, outputFile } = options;

  // Generate diff between branches
  const diff = await git.diff([
    `origin/${targetBranch}...origin/${sourceBranch}`,
    "--no-merges",
    "--unified=3",
  ]);

  // Save diff to file
  const outputPath = join(process.cwd(), outputFile);
  await fs.writeFile(outputPath, diff);

  return diff;
}

export async function getCurrentBranch(): Promise<string> {
  const branch = await git.revparse(["--abbrev-ref", "HEAD"]);
  return branch;
}

export async function branchExists(branchName: string): Promise<boolean> {
  try {
    await git.revparse(["--verify", `origin/${branchName}`]);
    return true;
  } catch (error) {
    return false;
  }
}
