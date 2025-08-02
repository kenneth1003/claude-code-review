export function sanitizeBranchNameForFilename(branchName: string): string {
  return branchName
    .replace(/\//g, "-")
    .replace(/[\s\\/:"*?<>|]+/g, "-")
    .replace(/^\.+/, "")
    .replace(/\.+$/, "")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export function generateDiffFilename(
  sourceBranch: string,
  targetBranch: string
): string {
  const sanitizedSource = sanitizeBranchNameForFilename(sourceBranch);
  const sanitizedTarget = sanitizeBranchNameForFilename(targetBranch);
  return `diff-${sanitizedSource}-${sanitizedTarget}.patch`;
}