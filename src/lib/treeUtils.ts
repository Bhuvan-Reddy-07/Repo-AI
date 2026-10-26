import { TreeItem } from '../types';

/**
 * Generates an ASCII tree structure similar to Gitingest / Unix `tree`
 */
export function generateAsciiTree(tree: TreeItem[], maxLines: number = 70): string {
  if (!tree || tree.length === 0) {
    return 'Directory tree empty or inaccessible.';
  }

  // Sort paths alphabetically
  const paths = tree.map((item) => item.path).sort();

  // Build a nested object
  const root: any = {};
  for (const path of paths) {
    const parts = path.split('/');
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        current[part] = null; // file
      } else {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    }
  }

  const lines: string[] = [];

  function printNode(node: any, prefix: string = '', depth: number = 0) {
    if (lines.length >= maxLines) {
      if (lines.length === maxLines) {
        lines.push(`${prefix}... [Remaining files truncated for readability]`);
      }
      return;
    }

    const entries = Object.keys(node).sort((a, b) => {
      const aIsDir = node[a] !== null;
      const bIsDir = node[b] !== null;
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });

    entries.forEach((entry, index) => {
      const isLast = index === entries.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const isDir = node[entry] !== null;

      lines.push(`${prefix}${connector}${entry}${isDir ? '/' : ''}`);

      if (isDir && depth < 3) {
        const nextPrefix = prefix + (isLast ? '    ' : '│   ');
        printNode(node[entry], nextPrefix, depth + 1);
      }
    });
  }

  lines.push('.');
  printNode(root, '', 0);

  return lines.join('\n');
}

/**
 * Estimates token count for repository files
 */
export function estimateTokenCount(tree: TreeItem[]): number {
  // Approximate total code bytes: filter blob items
  const totalBytes = tree
    .filter((i) => i.type === 'blob')
    .reduce((acc, curr) => acc + (curr.size || 1200), 0);

  // Approximate 1 token ~= 4 bytes of source code
  return Math.round(totalBytes / 4);
}

/**
 * Detects top entry point files
 */
export function detectEntrypointFiles(tree: TreeItem[]): string[] {
  const candidateScores: { path: string; score: number }[] = [];

  for (const item of tree) {
    if (item.type !== 'blob') continue;
    const path = item.path.toLowerCase();
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];

    let score = 0;
    if (fileName === 'index.ts' || fileName === 'index.js' || fileName === 'main.py' || fileName === 'app.py' || fileName === 'main.go' || fileName === 'lib.rs' || fileName === 'main.rs') {
      score += 50;
    } else if (fileName === 'app.tsx' || fileName === 'app.jsx' || fileName === 'server.js' || fileName === 'server.ts' || fileName === 'main.ts') {
      score += 40;
    } else if (fileName === 'cli.ts' || fileName === 'cli.py' || fileName === 'cli.js') {
      score += 35;
    }

    if (parts.length === 1) score += 10; // Root file
    if (parts.length === 2 && (parts[0] === 'src' || parts[0] === 'lib' || parts[0] === 'cmd')) score += 15;

    if (score > 0) {
      candidateScores.push({ path: item.path, score });
    }
  }

  candidateScores.sort((a, b) => b.score - a.score);
  return candidateScores.slice(0, 5).map((c) => c.path);
}
